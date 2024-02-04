import { createRouteHandler } from "uploadthing/next-legacy";

import { uploadRouter } from "~/server/uploadthing";

const handler = createRouteHandler({
  router: uploadRouter,
});

export default handler;

// url: "https://utfs.io/f/2f766643-edc8-41f5-9c20-e8bb2ab7ca70-1vuq0w.png"
// key: "2f766643-edc8-41f5-9c20-e8bb2ab7ca70-1vuq0w.png"
