import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import Card from "~/components/Card/Card";
import PageHead from "~/components/PageHead/PageHead";
import Search from "~/components/Search/Search";
import { api } from "~/utils/api";

export type FormStateType = {
  selectedCategories: string[];
  availableDates: DateValueType;
};

const Home: NextPage = () => {
  const router = useRouter();
  const queryParamsCount = Object.keys(router.query).length;
  const [formsSate, setFormsState] = useState<FormStateType>({
    selectedCategories: [],
    availableDates: {
      endDate: null,
      startDate: null,
    },
  });

  const { data, isLoading } = api.product.getAll.useQuery({
    category: formsSate.selectedCategories,
    // availableDatesEnd: new Date(formsSate.availableDates?.endDate ?? ""),
    ...(formsSate.availableDates?.endDate && {
      availableDatesEnd: new Date(formsSate.availableDates?.endDate),
    }),

    // availableDatesStart: new Date(formsSate.availableDates?.startDate ?? ""),
    ...(formsSate.availableDates?.startDate && {
      availableDatesStart: new Date(formsSate.availableDates?.startDate),
    }),
  });

  useEffect(() => {
    if (router.query.category && typeof router.query.category === "string") {
      const category = router.query.category.split(",");
      setFormsState((sate) => ({
        ...sate,
        selectedCategories: category,
      }));
    }
  }, [router.query.category]);

  useEffect(() => {
    if (router.query.start_date && router.query.end_date) {
      const startDate = new Date(router.query.start_date as string);
      const endDate = new Date(router.query.end_date as string);
      setFormsState((sate) => ({
        ...sate,
        availableDates: {
          endDate,
          startDate,
        },
      }));
    }
  }, [router.query.start_date, router.query.end_date]);

  return (
    <>
      <PageHead
        title="Trauku noma"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <Search
          formsSate={formsSate}
          queryParamsCount={queryParamsCount}
          setFormsState={setFormsState}
        />

        <div className="flex w-full items-center justify-center pt-5 md:pt-10">
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(310px,1fr))] gap-5 px-4">
            {isLoading && (
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                  Lādējās...
                </h1>
              </div>
            )}

            {!isLoading && data?.length !== 0 ? (
              data?.map((product) => (
                <Card key={product.id} product={product} />
              ))
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

export default Home;
