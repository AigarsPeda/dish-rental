import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/server/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

// export function generateUploadThingURL(path: `/${string}`) {
//   let host = "https://uploadthing.com";
//   if (process.env.CUSTOM_INFRA_URL) {
//     host = process.env.CUSTOM_INFRA_URL;
//   }
//   return `${host}${path}`;
// }

// /**
//  * Request to delete files from UploadThing storage.
//  * @param {string | string[]} fileKeys
//  * @example
//  * await deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
//  * @example
//  * await deleteFiles(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
//  */
// export const deleteFiles = async (fileKeys: string[] | string) => {
//   if (!Array.isArray(fileKeys)) fileKeys = [fileKeys];
//   // if (!UT_SECRET) throw new Error("Missing UPLOADTHING_SECRET env variable.");

//   const res = await fetch(generateUploadThingURL("/api/deleteFile"), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // "x-uploadthing-api-key": UT_SECRET,
//       "x-uploadthing-api-secret": env.UPLOADTHING_SECRET,
//       "x-uploadthing-version": "6.3.3",
//     },
//     body: JSON.stringify({ fileKeys }),
//   });
//   if (!res.ok) {
//     throw new Error("Failed to delete files");
//   }
//   return res.json() as Promise<{ success: boolean }>;
// };
