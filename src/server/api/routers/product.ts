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
import { OrderFormSchema } from "../../../types/order.schema";

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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

  createOrder: publicProcedure
    .input(OrderFormSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(">>>>", input);
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
});
