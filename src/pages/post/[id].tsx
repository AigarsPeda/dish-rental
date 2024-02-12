import { type NextPage } from "next";
import { useRouter } from "next/router";
import PageHead from "~/components/PageHead/PageHead";
import { api } from "../../utils/api";
import { useEffect, useState } from "react";

const PostPage: NextPage = () => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const post = api.post.getById.useQuery(
    { id: postId || 0 },
    { enabled: Boolean(postId) },
  );

  useEffect(() => {
    console.log("router.query.id", router.query.id);
    if (router.query.id) {
      // post.refetch();
      const id = Number(router.query.id);
      setPostId(id);
    }
  }, [router.query.id]);

  return (
    <>
      <PageHead
        title="Trauku noma | Mani sludinājumi"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Post: {router.query.id}
        </h1>
        <pre>{JSON.stringify(post.data, null, 2)}</pre>
      </main>
    </>
  );
};

export default PostPage;
