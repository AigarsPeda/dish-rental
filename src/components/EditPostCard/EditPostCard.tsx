import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import Toggle from "~/components/Toggle/Toggle";
import { type DBProductType } from "~/types/product.schema";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";
import getTitleImage from "~/utils/getTitleImage";

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

  const { mutate: mutatePostTitleImage } =
    api.product.changeTitleImage.useMutation({
      onMutate: ({ id, imageName }) => {
        // Optimistic update
        utils.product.getUsersPosts.setData(undefined, (prev) => {
          if (prev) {
            return prev.map((p) => {
              if (p.id === id) {
                return {
                  ...p,
                  titleImage: imageName,
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
    <div className="relative w-full max-w-[22.6rem] rounded-lg border bg-white shadow-sm">
      <div className="p-2">
        <Image
          priority
          alt="dish-rental"
          loader={ImageLoader}
          className={classNames(
            !post.isPublished && "grayscale",
            "overflow-hidden rounded-md ",
          )}
          src={
            getTitleImage(post.images, post.titleImage)?.url ??
            "/images/placeholder.jpeg"
          }
          width={300}
          height={300}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-1">
        {post?.images.map((file) => (
          <button
            type="button"
            key={file.name}
            className={classNames(
              file.name === post?.titleImage && "ring-2 ring-gray-900",
              "relative h-20 w-20 overflow-hidden rounded-md transition-all hover:ring-2 hover:ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900",
            )}
            onClick={() => {
              void mutatePostTitleImage({
                id: post.id,
                imageName: file.name,
              });
            }}
          >
            <Image
              width={0}
              height={0}
              src={file.url}
              alt={file.name}
              loader={ImageLoader}
              style={{
                width: "120px",
                height: "auto",
                objectFit: "cover",
              }}
            />
            {file.name === post?.titleImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                <p className="text-xs font-semibold text-white">Titulbilde</p>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="px-2 py-3">
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
