// import { getAuth } from "@clerk/nextjs/server";

import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

const f = createUploadthing({
  /**
   * Log out more information about the error, but don't return it to the client
   * @see https://docs.uploadthing.com/errors#error-formatting
   */
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  },
});

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const uploadRouter = {
  imageUpload: f({
    // key determines allowed file types
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    // videoAndImage: f({
    //   image: {
    //     maxFileSize: "4MB",
    //     maxFileCount: 4,
    //   },
    //   video: {
    //     maxFileSize: "16MB",
    //   },
    // })
    .middleware(({ req }) => {
      console.log("middleware", req);
      // const { userId } = getAuth(req);

      const userId = "123";

      if (!userId) {
        throw new Error("Please sign in");
      }

      return { userId };
    })
    .onUploadComplete(({ file, metadata }) => {
      metadata;
      // ^?
      console.log("upload completed", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
