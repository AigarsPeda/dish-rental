import { arrayContains, eq, gte } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { images, product } from "~/server/db/schema";
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
          availableDatesStart: input.availableDatesStart.getTime(),
          availableDatesEnd: input.availableDatesEnd.getTime(),
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
    .input(
      z.object({
        category: z.array(z.string()).nullable(),
        availableDatesStart: z.date().optional(),
        availableDatesEnd: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = new Date().getTime();
      // Set all products that are not published and are past their available date to unpublished
      await ctx.db
        .update(product)
        .set({ isPublished: false })
        .where(gte(product.availableDatesEnd, now));

      ctx.db.query.product.findMany({
        where: (product, { eq, gte, lte, and }) => {
          const whereConditions = [];

          if (input.availableDatesStart && input.availableDatesEnd) {
            const start = input.availableDatesStart?.getTime();
            const endDate = input.availableDatesEnd?.getTime();
            whereConditions.push(
              and(
                lte(product.availableDatesStart, start),
                gte(product.availableDatesEnd, endDate),
              ),
            );
          }
          // else {
          //   const now = new Date().getTime();
          //   whereConditions.push(gte(product.availableDatesEnd, now));
          // }

          if (input.category && input.category?.length > 0) {
            whereConditions.push(
              arrayContains(product.categories, input.category),
            );
          }

          whereConditions.push(eq(product.isPublished, true));

          // Combining all conditions with AND
          return and(...whereConditions);
        },

        // orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          images: true,
        },
      });

      const products = ctx.db.query.product.findMany({
        where: (product, { eq, gte, lte, and }) => {
          const whereConditions = [];

          // if (input.availableDatesStart && input.availableDatesEnd) {
          //   const start = input.availableDatesStart?.getTime();
          //   const endDate = input.availableDatesEnd?.getTime();
          //   whereConditions.push(
          //     and(
          //       lte(product.availableDatesStart, start),
          //       gte(product.availableDatesEnd, endDate),
          //     ),
          //   );
          // } else {
          //   const now = new Date().getTime();
          //   whereConditions.push(gte(product.availableDatesEnd, now));
          // }

          // if (input.category && input.category?.length > 0) {
          //   whereConditions.push(
          //     arrayContains(product.categories, input.category),
          //   );
          // }

          whereConditions.push(eq(product.isPublished, true));

          // Combining all conditions with AND
          return and(...whereConditions);
        },
        orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          images: true,
        },
      });

      return products;
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

  changeTitleImage: protectedProcedure
    .input(z.object({ id: z.number(), imageName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
        with: {
          images: true,
        },
      });

      if (!post) {
        throw new Error("post not found");
      }

      // try to find the image in the post by name if not found throw error
      const titleImage = post.images.find(
        (image) => image.name === input.imageName,
      );
      if (!titleImage) {
        throw new Error("image not found");
      }

      // const titleImage = post.images[0].id;

      await ctx.db
        .update(product)
        .set({ titleImage: input.imageName })
        .where(eq(product.id, input.id));

      return `changed title image for post: ${input.id}`;
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
