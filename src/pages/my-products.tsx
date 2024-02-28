import { type NextPage } from "next";
import EditPostCard from "~/components/EditPostCard/EditPostCard";
import PageHead from "~/components/PageHead/PageHead";
import { api } from "~/utils/api";

const MyPosts: NextPage = () => {
  const { data, isLoading } = api.product.getUsersPosts.useQuery();
  return (
    <>
      <PageHead
        title="Trauku noma | Mani sludinājumi"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="px-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Mani sludinājumi
        </h1>
        <div className="flex w-full items-center justify-center pt-5 md:pt-10">
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(310px,1fr))] gap-5 px-4">
            {isLoading && (
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                  Lādējās...
                </h1>
              </div>
            )}

            {data?.length !== 0 ? (
              data?.map((post) => <EditPostCard key={post.id} post={post} />)
            ) : (
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                Nevies sludinājumu vēl nav pievienoti :(
              </h1>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default MyPosts;
