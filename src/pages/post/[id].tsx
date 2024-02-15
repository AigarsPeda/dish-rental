import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "~/components/PageHead/PageHead";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import NumberInput from "../../components/NumberInput/NumberInput";

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
        image={data?.images[0]?.url}
        title={data?.name ?? "Trauku noma | Izveidot jaunu sludinājumu"}
        descriptionLong={data?.description ?? "Nomā vai iznomā traukus"}
        descriptionShort={data?.description ?? "Nomā vai iznomā traukus"}
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

              <div className="mt-4 flex flex-wrap gap-2">
                {splitCategories(data?.categories ?? "").map((category) => (
                  <span
                    key={category}
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 md:px-6 md:py-2"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="pt-8">
                <p className="text-gray-700">{data?.description}</p>
              </div>
            </div>

            <div>
              <div className="mt-4">
                <p className="text-gray-400">
                  Pieejamas{" "}
                  <span className="font-semibold text-gray-800">
                    {" "}
                    {data?.availablePieces}{" "}
                  </span>{" "}
                  vienības
                </p>
              </div>
              <div className="mt-8 items-end justify-between gap-2 xl:flex">
                <div className="mb-4 flex items-end xl:mb-0">
                  <h1 className="m-0 p-0 text-5xl font-bold">{data?.price}</h1>
                  <span className="ml-2 text-base text-gray-400">
                    € / dienā
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="w-40">
                    <NumberInput
                      id="product-price"
                      value={0}
                      onChange={() => {
                        console.log("changed");
                      }}
                    />
                  </div>
                  <button
                    onClick={() => router.back()}
                    className="flex h-11 items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-gray-50"
                  >
                    <ShoppingCartIcon size="sm" />
                    Ielikt grozā
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostPage;
