import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "src/server/auth";
import { db } from "src/server/db";
import { images, product } from "src/server/db/schema";
import { env } from "~/env";

// export async function POST(request: NextRequest) {
//   console.log(">>>", request);

// Step 1: Check if user is authenticated (With NextAuth)
// const session = await getServerSession(authOptions);
// if (!session) {
//   return NextResponse.json(null, { status: 401 });
// }

// Step 2: Get image from request (With Next.js API Routes)
// const formData = await request.formData();

// console.log(">>>", ...formData);

// const imageFile = formData.get("image") as unknown as File | null;

// if (!imageFile) {
//   return NextResponse.json(null, { status: 400 });
// }
// const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

// Step 3: Resize image (With Sharp)
// const editedImageBuffer = await sharp(imageBuffer)
//   .resize({ height: 256, width: 256, fit: 'cover' })
//   .toBuffer()

// Step 4: Upload image (With AWS SDK)
// const imageUrl = await uploadToS3({
//   buffer: editedImageBuffer,
//   key: `profile-images/${session.user.id}`,
//   contentType: imageFile.type,
// })

// Step 5: Update user in database (With Drizzle ORM)
// await db
//   .update(users)
//   .set({
//     image: imageUrl,
//   })
//   .where(eq(users.id, session.user.id))

// Step 6: Return new image URL
// return NextResponse.json({ imageUrl })
// }

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "5mb", // Set desired value here
//     },
//   },
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const runtime = "edge";

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.ACCESS_KEY_AWS,
    secretAccessKey: env.SECRET_AWS,
  },
  region: env.REGION_AWS,
});

// type RequestWithFormData = NextApiRequest & {
//   formData: () => Promise<FormData>;
// };

export default async function POST(
  request: NextRequest,
  response: NextResponse,
) {
  // const req = request as unknown as NextApiRequest;
  // const res = response as unknown as NextApiResponse;
  // const session = await getServerSession(request, response, authOptions);
  // if (!session) {
  //   return NextResponse.json(null, { status: 401 });
  // }

  // console.log(">>> session", session);

  const formData = await request.formData();
  const files = formData.getAll("image") as File[];

  const imgResponse = await Promise.all(
    files.map(async (file) => {
      // not sure why I have to override the types here
      const Body = (await file.arrayBuffer()) as Buffer;

      const encodeFileName = encodeURIComponent(`${Date.now()}-${file.name}`);
      await s3.send(
        new PutObjectCommand({
          Bucket: env.BUCKET_NAME_AWS,
          Key: encodeFileName,
          Body,
        }),
      );

      return {
        url: `https://${env.BUCKET_NAME_AWS}.s3.${env.REGION_AWS}.amazonaws.com/${encodeFileName}`,
        key: encodeFileName,
        name: file.name,
        size: file.size,
      };
    }),
  );

  const formattedFields = {
    name: formData.get("name")?.toString(),
    price: Number(formData.get("price")?.toString()),
    titleImage: formData.get("titleImage")?.toString(),
    description: formData.get("description")?.toString(),
    categories: formData.get("categories")?.toString().split(","),
    availablePieces: Number(formData.get("availablePieces")?.toString()),
    isPublished:
      formData.get("isPublished")?.toString() === "true" ? true : false,
    availableDatesEnd: Number(formData.get("availableDatesEnd")?.toString()),
    availableDatesStart: Number(
      formData.get("availableDatesStart")?.toString(),
    ),
  };

  // const ids = await db
  //   .insert(product)
  //   .values({
  //     name: formattedFields.name,
  //     price: formattedFields.price,
  //     createdById: "1",
  //     categories: formattedFields.categories,
  //     titleImage: formattedFields.titleImage,
  //     isPublished: formattedFields.isPublished,
  //     description: formattedFields.description,
  //     availablePieces: formattedFields.availablePieces,
  //     availableDatesStart: formattedFields.availableDatesStart,
  //     availableDatesEnd: formattedFields.availableDatesEnd,
  //   })
  //   .returning({ id: product.id });

  // const postId = ids[0]?.id;

  // if (!postId || imgResponse.length === 0) {
  //   throw new Error("failed to create post");
  // }

  // await db.insert(images).values(
  //   imgResponse.map((image) => {
  //     return {
  //       postId: postId,
  //       url: image.url,
  //       key: image.key,
  //       name: image.name,
  //       size: image.size,
  //     };
  //   }),
  // );

  // return response.status(200).json({ postId });

  // return response.json();
  return new NextResponse("Thank you");
  // return NextResponse.json({ postId }, { status: 200 });
}

// export default async function POST(
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) {
//   // const session = await getServerSession(authOptions);
//   const session = await getServerSession(request, response, authOptions);
//   if (!session) {
//     return NextResponse.json(null, { status: 401 });
//   }

//   const form = formidable({});

//   const s3 = new S3Client({
//     credentials: {
//       accessKeyId: env.ACCESS_KEY_AWS,
//       secretAccessKey: env.SECRET_AWS,
//     },
//     region: env.REGION_AWS,
//   });

//   try {
//     const [fields, files] = await form.parse(request);
//     console.log(">>> fields", fields);
//     console.log(">>> files", files);

//     files.image.map(async (file) => {
//       console.log(">>> file 1111", file);
//     });

//     // const response = await Promise.all(
//     //   files.image.map(async (file) => {
//     //     // not sure why I have to override the types here
//     //     const Body = (await file.arrayBuffer()) as Buffer;
//     //     s3.send(
//     //       new PutObjectCommand({ Bucket: "dish-rent", Key: file.name, Body }),
//     //     );
//     //   }),
//     // );

//     // console.log(">>> response", response);

//     // new File([files.image as unknown as Blob], "foo.jpg");

//     // const response = await utapi.uploadFiles(
//     //   new File([files.image[0]], "foo.jpg"),
//     // );

//     // // URL.createObjectURL(f)

//     // // create files from files.image and upload them to s3 using utapi.uploadFiles
//     // const imageRes = await utapi.uploadFiles(
//     //   files.image?.map((file) => {
//     //     console.log(">>> ???? file", file);
//     //     file.newFilename;
//     //     const f = file as unknown as File;
//     //     return new File([f], `${f.newFilename}.jpg`);
//     //   }),
//     // );

//     // const mappedFiles = files.image?.map((file) => {
//     //   console.log(">>> ???? file", file);
//     //   return new File([file as unknown as Blob], `${file.newFilename}.jpg`);
//     // });
//     // console.log(">>> mappedFiles", mappedFiles);

//     // console.log(">>> response", response);

//     // name: [ 'Hey' ],
//     // price: [ '0.3' ],
//     // titleImage: [ 'Assorted Bow.jpg' ],
//     // isPublished: [ 'true' ],
//     // description: [ 'Nice post' ],
//     // categories: [ 'trauki,mebeles_un_tekstils,dekoracijas_galda_klasanai' ],
//     // availablePieces: [ '3' ],
//     // availableDatesStart: [ '1710188456512' ],
//     // availableDatesEnd: [ '1712863256512' ]

//     // parse fields and insert them into the database
//     const formattedFields = {
//       name: fields.name?.toString(),
//       price: Number(fields.price?.toString()),
//       titleImage: fields.titleImage?.toString(),
//       description: fields.description?.toString(),
//       categories: fields.categories?.toString().split(","),
//       availablePieces: Number(fields.availablePieces?.toString()),
//       availableDatesEnd: Number(fields.availableDatesEnd?.toString()),
//       availableDatesStart: Number(fields.availableDatesStart?.toString()),
//       isPublished: fields.isPublished?.toString() === "true" ? true : false,
//     };

// const ids = await db
//   .insert(product)
//   .values({
//     name: formattedFields.name,
//     price: formattedFields.price,
//     createdById: session.user.id,
//     categories: formattedFields.categories,
//     titleImage: formattedFields.titleImage,
//     isPublished: formattedFields.isPublished,
//     description: formattedFields.description,
//     availablePieces: formattedFields.availablePieces,
//     availableDatesStart: formattedFields.availableDatesStart,
//     availableDatesEnd: formattedFields.availableDatesEnd,
//   })
//   .returning({ id: product.id });

//     // console.log(">>> ids", ids);

// const postId = ids[0]?.id;

// if (!postId || !imageRes) {
//   throw new Error("failed to create post");
// }

// imageRes.data?.map((image) => {
//   return {
//     postId: postId,
//     url: image.url,
//     key: image.key,
//     name: image.name,
//     size: image.size,
//   };
// }

//     // key: 'c2fc6cc2-f693-4a50-9027-4e9ff4b6c1d6-r99sa9',
//     // url: 'https://utfs.io/f/c2fc6cc2-f693-4a50-9027-4e9ff4b6c1d6-r99sa9',
//     // name: 'de81cde56b40b44944119e72b',
//     // size: 146,
//     // type: '',
//     // customId: null

// await db.insert(images).values(
//   imageRes?.map((image) => {
//     console.log(">>> image.data", image.data);
//     return {
//       postId: postId,
//       url: image.data.url,
//       key: image.data.key,
//       name: image.data.name,
//       size: image.data.size,
//     };
//   }),
// );

//     // console.log(">>> formattedFields", formattedFields);

//     // await db
//     // .insert(product)
//     // .values({
//     //   name: fields.name,
//     //   price: fields.price,
//     //   titleImage: fields.titleImage,
//     //   isPublished: fields.isPublished,
//     //   description: fields.description,
//     //   createdById: ctx.session.user.id,
//     //   categories: fields.categories,
//     //   availablePieces: fields.availablePieces,
//     //   availableDatesStart: fields.availableDatesStart.getTime(),
//     //   availableDatesEnd: fields.availableDatesEnd.getTime(),
//     // })
//     // .returning({ id: product.id });

//     // console.log(">>> imageRes", imageRes);
//   } catch (error) {
//     response.status(500).json({
//       error,
//       message: "Error parsing form data",
//     });
//   }

//   // console.log(">>> session", session);
//   // console.log(">>> request", request);

//   // console.log(">>>>>> ????", await request.body.formData());

//   // const requestBody = await request.body.formatDate();
//   // console.log(">>> requestBody", requestBody);
//   // console.log(">>> requestBody", requestBody);
//   // response.status(200).json({ message: "Hello from Next.js!" });
// }

// // Export types for API Routes
// export type UploadProfileImageResponse = ExtractGenericFromNextResponse<
//   Awaited<ReturnType<typeof POST>>
// >;
// type ExtractGenericFromNextResponse<Type> =
//   Type extends NextResponse<infer X> ? X : never;
