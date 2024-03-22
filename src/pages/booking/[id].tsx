import { type NextPage } from "next";
import { useRouter } from "next/router";
import { type DateValueType } from "react-tailwindcss-datepicker";
import PageHead from "~/components/PageHead/PageHead";

export type FormStateType = {
  selectedCategories: string[];
  availableDates: DateValueType;
};

const Home: NextPage = () => {
  const router = useRouter();

  console.log("Add state to url?");

  return (
    <>
      <PageHead
        title="Trauku noma"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="mt-8 text-center text-3xl font-bold">
          Trauku noma {router.query.id}
        </h1>
      </main>
    </>
  );
};

export default Home;
