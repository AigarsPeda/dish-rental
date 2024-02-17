import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";

const EditPage: NextPage = () => {
  // const router = useRouter();
  // const [postId, setPostId] = useState<number | null>(null);
  // const { data, isLoading } = api.post.getById.useQuery(
  //   { id: postId ?? 1 },
  //   { enabled: postId !== null },
  // );

  // const splitCategories = (categories: string) => {
  //   return categories.split(",");
  // };

  // useEffect(() => {
  //   if (router.query.id && typeof router.query.id === "string") {
  //     const id = parseInt(router.query.id, 10);
  //     setPostId(id);
  //   }
  // }, [router.query.id]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <PageHead
        title={"Trauku noma | Labot sludinājumu"}
        descriptionLong={"Nomā vai iznomā traukus"}
        descriptionShort={"Nomā vai iznomā traukus"}
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="px-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Labot sludinājumu
        </h1>
      </main>
    </>
  );
};

export default EditPage;
