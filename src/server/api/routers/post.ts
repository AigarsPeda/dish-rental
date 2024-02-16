import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts, images } from "~/server/db/schema";
import { utapi } from "~/server/uploadthing";
import { NewPostSchema } from "~/types/post.schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(NewPostSchema)
    .mutation(async ({ ctx, input }) => {
      const ids = await ctx.db
        .insert(posts)
        .values({
          name: input.name,
          price: input.price,
          description: input.description,
          createdById: ctx.session.user.id,
          categories: input.categories.join(","),
          availablePieces: input.availablePieces,
        })
        .returning({ id: posts.id });

      const postId = ids[0]?.id;

      if (!postId) {
        throw new Error("failed to create post");
      }

      await ctx.db.insert(images).values(
        input.imagesData.map((image) => {
          return {
            postId: postId,
            url: image.url,
            key: image.key,
            name: image.name,
            size: image.size,
          };
        }),
      );

      return {
        postId,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      const post = ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, input.id),
        with: {
          images: true,
        },
      });

      return post;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      with: {
        images: true,
      },
    });
  }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  deleteImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await utapi.deleteFiles(input);
      return `deleted image: ${input}`;
    }),
});
