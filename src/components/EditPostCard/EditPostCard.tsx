import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import Toggle from "~/components/Toggle/Toggle";
import { type DBProductType } from "~/types/product.schema";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";

interface EditPostCardProps {
  post: DBProductType;
}

const EditPostCard: FC<EditPostCardProps> = ({ post }) => {
  const utils = api.useUtils();
  const { mutate } = api.product.setPublished.useMutation({
    onMutate: ({ id, isPublished }) => {
      // Optimistic update
      utils.product.getUsersPosts.setData(undefined, (prev) => {
        if (prev) {
          return prev.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                isPublished,
              };
            }
            return p;
          });
        }
        return prev;
      });
    },
    onSuccess: async () => {
      await utils.product.getUsersPosts.invalidate();
    },
  });

  return (
    <div className="relative w-full rounded-lg border bg-white shadow-sm">
      <Image
        priority
        alt="dish-rental"
        loader={ImageLoader}
        className={classNames(
          !post.isPublished && "grayscale",
          "overflow-hidden rounded-lg p-1",
        )}
        src={post.images[0]?.url ?? "/images/placeholder.jpeg"}
        width={300}
        height={300}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />
      <div className="px-2.5 py-1.5 md:px-5 md:py-2.5">
        <p className="text-3xl font-bold text-gray-900">{post.name}</p>
        <div className="mt-2.5 flex flex-wrap items-center justify-between transition-all">
          <div className="mt-4 flex w-full justify-between gap-4">
            <Toggle
              label="Publicēts"
              isChecked={post.isPublished}
              handleChange={() => {
                void mutate({ id: post.id, isPublished: !post.isPublished });
              }}
            />
            <Link
              href={{
                pathname: `/product/${post.id}/edit`,
              }}
              className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
            >
              Rediģēt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostCard;
