import { type GetServerSidePropsContext } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";

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
      maxFileSize: "2MB",
      maxFileCount: 4,
    },
  })
    .middleware(async ({ req, res }) => {
      const request = req as unknown as GetServerSidePropsContext["req"];
      const response = res as unknown as GetServerSidePropsContext["res"];

      const session = await getServerAuthSession({
        req: request,
        res: response,
      });

      if (!session?.user.id)
        throw new UploadThingError("Please sign in, No user ID");

      return { userId: session?.user.id };
    })
    .onUploadComplete(({ file, metadata }) => {
      metadata;
      // ^?
      console.log("upload completed", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
