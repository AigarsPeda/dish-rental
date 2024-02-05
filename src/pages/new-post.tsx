import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";
import Card from "~/components/Card/Card";
import ProfileDropdown from "~/components/ProfileDropdown/ProfileDropdown";
import PageHead from "~/components/PageHead/PageHead";
import { type NextPage } from "next";

const NewPost: NextPage = () => {
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
        title="Trauku noma | Izveidot jaunu sludinājumu"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Izveidot jaunu sludinājumu
        </h1>
      </main>
    </>
  );
};

export default NewPost;

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
