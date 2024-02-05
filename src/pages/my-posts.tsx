import { type NextPage } from "next";
import PageHead from "~/components/PageHead/PageHead";

const MyPosts: NextPage = () => {
  return (
    <>
      <PageHead
        title="Trauku noma | Mani sludinājumi"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Mani sludinājumi
        </h1>
      </main>
    </>
  );
};

export default MyPosts;
