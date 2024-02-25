import { arrayContains, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { product, images } from "~/server/db/schema";
import { utapi } from "~/server/uploadthing";
import { NewProductSchema } from "~/types/product.schema";

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(NewProductSchema)
    .mutation(async ({ ctx, input }) => {
      const ids = await ctx.db
        .insert(product)
        .values({
          name: input.name,
          price: input.price,
          titleImage: input.titleImage,
          isPublished: input.isPublished,
          description: input.description,
          createdById: ctx.session.user.id,
          categories: input.categories,
          availablePieces: input.availablePieces,
          availableDatesStart: input.availableDatesStart,
          availableDatesEnd: input.availableDatesEnd,
        })
        .returning({ id: product.id });

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
      const post = ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
        with: {
          images: true,
        },
      });

      return post;
    }),

  getAll: publicProcedure
    .input(z.object({ category: z.array(z.string()).nullable() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.product.findMany({
        where: (product, { eq }) => {
          if (
            input.category &&
            input.category.length > 0 &&
            eq(product.isPublished, true)
          ) {
            return arrayContains(product.categories, input.category);
          }
          return eq(product.isPublished, true);
        },
        orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          images: true,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.product.findFirst({
      orderBy: (product, { desc }) => [desc(product.createdAt)],
    });
  }),

  setPublished: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(product)
        .set({ isPublished: input.isPublished })
        .where(eq(product.id, input.id));

      return `updated post: ${input.id}`;
    }),

  getUsersPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.product.findMany({
      where: (product, { eq }) => eq(product.createdById, ctx.session.user.id),
      orderBy: (product, { desc }) => [desc(product.createdAt)],
      with: {
        images: true,
      },
    });
  }),

  deleteImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await utapi.deleteFiles(input);
      return `deleted image: ${input}`;
    }),
});
