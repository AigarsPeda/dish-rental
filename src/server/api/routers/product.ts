import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { arrayContains, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { images, product } from "~/server/db/schema";
import { s3 } from "~/utils/aws/awsClient";

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: protectedProcedure
  //   .input(NewProductSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const ids = await ctx.db
  //       .insert(product)
  //       .values({
  //         name: input.name,
  //         price: input.price,
  //         categories: input.categories,
  //         titleImage: input.titleImage,
  //         isPublished: input.isPublished,
  //         description: input.description,
  //         createdById: ctx.session.user.id,
  //         availablePieces: input.availablePieces,
  //         availableDatesStart: input.availableDatesStart.getTime(),
  //         availableDatesEnd: input.availableDatesEnd.getTime(),
  //       })
  //       .returning({ id: product.id });

  //     const postId = ids[0]?.id;

  //     if (!postId) {
  //       throw new Error("failed to create post");
  //     }

  //     await ctx.db.insert(images).values(
  //       input.imagesData.map((image) => {
  //         return {
  //           postId: postId,
  //           url: image.url,
  //           key: image.key,
  //           name: image.name,
  //           size: image.size,
  //         };
  //       }),
  //     );

  //     return {
  //       postId,
  //     };
  //   }),

  deleteImage: protectedProcedure
    .input(z.object({ key: z.string(), postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const command = new DeleteObjectCommand({
        Key: input.key,
        Bucket: env.BUCKET_NAME_AWS,
      });
      const response = await s3.send(command);

      if (
        !response.$metadata.httpStatusCode ||
        response.$metadata.httpStatusCode !== 204
      ) {
        throw new Error("failed to delete image");
      }

      const ids = await ctx.db
        .delete(images)
        .where(eq(images.key, input.key))
        .returning({
          id: images.id,
        });

      return {
        ids,
      };
    }),

  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbImages = await ctx.db.query.images.findMany({
        where: (image, { eq }) => eq(image.postId, input.id),
      });

      const keys = dbImages.map((image) => image.key);

      if (keys.length > 0) {
        const command = new DeleteObjectsCommand({
          Bucket: env.BUCKET_NAME_AWS,
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
          },
        });

        await s3.send(command);
      }

      // Images are deleted with cascade
      const ids = await ctx.db
        .delete(product)
        .where(eq(product.id, input.id))
        .returning({
          id: product.id,
        });

      return {
        ids,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      const post = ctx.db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, parseInt(input.id)),
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
        .where(lt(product.availableDatesEnd, now));

      const products = await ctx.db.query.product.findMany({
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

          if (input.category && input.category?.length > 0) {
            whereConditions.push(
              arrayContains(product.categories, input.category),
            );
          }

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

  // updateProduct: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.number(),
  //       name: z.string().optional(),
  //       price: z.number().optional(),
  //       titleImage: z.string().optional(),
  //       description: z.string().optional(),
  //       isPublished: z.boolean().optional(),
  //       availablePieces: z.number().optional(),
  //       availableDatesEnd: z.number().optional(),
  //       availableDatesStart: z.number().optional(),
  //       categories: z.array(z.string()).optional(),
  //       // imagesToDelete: z.array(DBImageSchema).optional(),
  //     }),
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     // if (input.imagesToDelete && input.imagesToDelete.length > 0) {
  //     //   for (const image of input.imagesToDelete) {
  //     //     await ctx.db
  //     //       .delete(images)
  //     //       .where(and(eq(images.key, image.key), eq(images.postId, input.id)));
  //     //   }

  //     //   await utapi.deleteFiles(input.imagesToDelete.map((image) => image.key));
  //     // }

  //     await ctx.db
  //       .update(product)
  //       .set({
  //         name: input.name,
  //         price: input.price,
  //         categories: input.categories,
  //         titleImage: input.titleImage,
  //         isPublished: input.isPublished,
  //         description: input.description,
  //         availablePieces: input.availablePieces,
  //         availableDatesEnd: input.availableDatesEnd,
  //         availableDatesStart: input.availableDatesStart,
  //       })
  //       .where(eq(product.id, input.id));

  //     return `updated post: ${input.id}`;
  //   }),

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
      // const titleImage = post.images.find(
      //   (image) => image.name === input.imageName,
      // );

      // if (!titleImage) {
      //   throw new Error("image not found");
      // }

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

  // deleteImage: protectedProcedure
  //   .input(z.object({ imageName: z.string() }))
  //   .mutation(async ({ input }) => {
  //     await utapi.deleteFiles([input.imageName]);
  //     return `deleted image: ${input}`;
  //   }),
});
