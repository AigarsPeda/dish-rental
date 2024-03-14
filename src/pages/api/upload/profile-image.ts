import { formatDate } from "~/utils/dateUtils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "src/server/auth";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function POST(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(request, response, authOptions);
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(request);
    console.log(">>> fields", fields);
    console.log(">>> files", files);
  } catch (error) {
    response.status(500).json({
      error,
      message: "Error parsing form data",
    });
  }

  // console.log(">>> session", session);
  // console.log(">>> request", request);

  // console.log(">>>>>> ????", await request.body.formData());

  // const requestBody = await request.body.formatDate();
  // console.log(">>> requestBody", requestBody);
  // console.log(">>> requestBody", requestBody);
  // response.status(200).json({ message: "Hello from Next.js!" });
}

// Export types for API Routes
export type UploadProfileImageResponse = ExtractGenericFromNextResponse<
  Awaited<ReturnType<typeof POST>>
>;
type ExtractGenericFromNextResponse<Type> =
  Type extends NextResponse<infer X> ? X : never;
