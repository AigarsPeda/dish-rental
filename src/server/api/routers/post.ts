import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
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

  // type ImageDataType = {
  //   key: string;
  //   name: string;
  //   serverData: unknown;
  //   size: number;
  //   url: string;
  // };

  // type NewPostType = {
  //   categories: string[];
  //   description: string;
  //   imagesData: ImageDataType[];
  //   name: string;
  // };

  create: protectedProcedure
    .input(NewPostSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("creating post >>>>>", input);
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // await ctx.db.insert(posts).values({
      //   name: input.name,
      //   createdById: ctx.session.user.id,
      // });
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

// export function generateUploadThingURL(path: `/${string}`) {
//   let host = "https://uploadthing.com";
//   if (process.env.CUSTOM_INFRA_URL) {
//     host = process.env.CUSTOM_INFRA_URL;
//   }
//   return `${host}${path}`;
// }
