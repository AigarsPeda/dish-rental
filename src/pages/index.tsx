import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";
import Card from "~/components/Card/Card";
import ProfileDropdown from "~/components/ProfileDropdown/ProfileDropdown";
import PageHead from "../components/PageHead/PageHead";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const { mutate } = api.post.deleteImage.useMutation();

  const createArray = (length: number) => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <>
      <PageHead
        title="Trauku noma"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <div className="mb-4 flex items-center justify-between bg-gray-300 px-4 py-2 shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src="/images/dish_rent.png"
              alt="dish-rental"
              className="rounded-full"
              width={50}
              height={50}
            />
            <p className="text-3xl  font-extrabold tracking-tight text-black">
              Dish rental
            </p>
          </div>
          <div>
            <ProfileDropdown />
            {/* <LoginLogOutButton /> */}
            {/* <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                // onClick={hello.revalidate}
              >
                Refresh
              </button> */}
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          {/* <Card /> */}
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(310px,1fr))] gap-5 px-4">
            {createArray(10).map((i) => (
              <Card key={i} />
            ))}
          </div>
        </div>
        {/* <Card /> */}
        {/* <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Dish rental
          </h1>
          <h2 className="text-2xl text-white">
            Rent your dishes and make money
          </h2>
          <Image
            src="/images/dish_rent.png"
            alt="dish-rental"
            width={500}
            height={500}
          />
        </div> */}

        {/* <div className="flex flex-col items-center gap-2">
          <p className="text-3xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <AuthShowcase />
        </div>
        <UploadButton
          endpoint="imageUpload"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            // TODO: save url to db with id of the user
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        <button
          onClick={() =>
            // deleteFiles("4867186a-23e9-45e1-bbde-517f1865ed95-hk0kl7.png")
            // mutate("4867186a-23e9-45e1-bbde-517f1865ed95-hk0kl7.png")
            // deleteValue()
            mutate("2f766643-edc8-41f5-9c20-e8bb2ab7ca70-1vuq0w.png")
          }
        >
          Delete image
        </button> */}
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

const LoginLogOutButton = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center">
      <p className="text-center text-gray-900">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="px-10 py-2 font-semibold text-gray-900 no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Izlogoties " : "Ielogoties"}
      </button>
    </div>
  );
};
