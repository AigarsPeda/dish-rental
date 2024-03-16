import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { db } from "~/server/db";
import { images, product } from "~/server/db/schema";

const ImageSchema = z.object({
  url: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
});

const BodySchema = z.object({
  name: z.string(),
  price: z.number(),
  userId: z.string(),
  titleImage: z.string(),
  description: z.string(),
  isPublished: z.boolean(),
  availablePieces: z.number(),
  images: z.array(ImageSchema),
  availableDatesEnd: z.number(),
  categories: z.array(z.string()),
  availableDatesStart: z.number(),
});

export default async function POST(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const body = BodySchema.parse(request.body);

  const ids = await db
    .insert(product)
    .values({
      name: body.name,
      price: body.price,
      createdById: body.userId,
      categories: body.categories,
      titleImage: body.titleImage,
      isPublished: body.isPublished,
      description: body.description,
      availablePieces: body.availablePieces,
      availableDatesEnd: body.availableDatesEnd,
      availableDatesStart: body.availableDatesStart,
    })
    .returning({ id: product.id });

  const postId = ids[0]?.id;

  if (!postId) {
    return;
  }
  console.log(">>> postId", postId);

  if (!postId) {
    throw new Error("failed to create post");
  }

  await db.insert(images).values(
    body.images.map((image) => {
      return {
        postId: postId,
        url: image.url,
        key: image.key,
        name: image.name,
        size: image.size,
      };
    }),
  );

  return response.status(200).json({ postId });
}
