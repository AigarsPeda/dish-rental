import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { s3 } from "~/utils/aws/awsClient";

export const runtime = "edge";

export default async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("image") as File[];

  const cookies = request.headers.get("cookie")?.split("; ") ?? [];

  const sessionToken = cookies
    ?.find((cookie) => cookie.startsWith("next-auth.session-token"))
    ?.split("=")[1];

  if (!sessionToken) {
    return NextResponse.json(null, { status: 401 });
  }

  const imgResponse = await Promise.all(
    files.map(async (file, i) => {
      const Body = (await file.arrayBuffer()) as Buffer;

      const encodeFileName = encodeURIComponent(
        `${Date.now()}_${i}_${crypto.randomUUID()}`,
      );

      await s3.send(
        new PutObjectCommand({
          Body,
          Key: encodeFileName,
          Bucket: env.BUCKET_NAME_AWS,
        }),
      );

      return {
        name: file.name,
        size: file.size,
        key: encodeFileName,
        url: `https://${env.BUCKET_NAME_AWS}.s3.${env.REGION_AWS}.amazonaws.com/${encodeFileName}`,
      };
    }),
  );

  const formattedFields = {
    sessionToken,
    name: formData.get("name")?.toString(),
    userId: formData.get("userId")?.toString(),
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

  const origin = request.headers.get("origin");
  const action = request.headers.get("action");

  if (action === "new-create-product") {
    const createdPost = await fetch(`${origin}/api/upload/create-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        ...formattedFields,
        images: imgResponse,
      }),
    });

    if (!createdPost.ok) {
      return NextResponse.json(null, { status: 500 });
    }

    const data = (await createdPost.json()) as { postId: number };

    return new NextResponse(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "update-product") {
    const postId = formData.get("postId")?.toString();

    // const updatedPost = await fetch(`${origin}/api/upload/update-product`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     credentials: "include",
    //   },
    //   body: JSON.stringify({
    //     ...formattedFields,
    //     postId,
    //     images: imgResponse,
    //   }),
    // });

    // if (!updatedPost.ok) {
    //   return NextResponse.json(null, { status: 500 });
    // }

    // const data = (await updatedPost.json()) as { postId: number };

    // return new NextResponse(JSON.stringify(data), {
    //   headers: { "Content-Type": "application/json" },
    // });
  }
}
