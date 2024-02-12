import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "~/components/PageHead/PageHead";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = api.post.getById.useQuery(
    { id: postId ?? 1 },
    { enabled: postId !== null },
  );

  const splitCategories = (categories: string) => {
    return categories.split(",");
  };

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      const id = parseInt(router.query.id, 10);
      setPostId(id);
    }
  }, [router.query.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHead
        title="Trauku noma | Mani sludinājumi"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <div className="p-4 md:flex">
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="flex flex-row gap-4 md:flex-col">
              {data?.images.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.name}
                  width={100}
                  height={100}
                  loader={ImageLoader}
                  className="h-24 w-24 rounded-lg object-cover shadow-lg"
                />
              ))}
            </div>
            <div className="">
              <Image
                src={data?.images[0]?.url ?? "/images/placeholder.png"}
                alt={data?.images[0]?.name ?? "Image"}
                width={500}
                height={500}
                loader={ImageLoader}
                className="h-full max-h-[28rem] w-[28rem] rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between pt-5 md:pl-10 md:pt-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {data?.name}
              </h1>
              <div className="pt-4">
                <p className="text-gray-700">{data?.description}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {splitCategories(data?.categories ?? "").map((category) => (
                  <span
                    key={category}
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 md:px-6 md:py-2"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-end">
                <h1 className="m-0 p-0 text-4xl font-bold">3.00 €</h1>
                <span className="ml-2 text-base text-gray-400">/ dienā</span>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-gray-50"
              >
                <ShoppingCartIcon size="sm" />
                Ielikt grozā
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostPage;
