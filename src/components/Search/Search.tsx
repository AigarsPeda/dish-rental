import { ALL_OPTIONS } from "hardcoded";
import { useRouter } from "next/router";
import { type FC } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { classNames } from "uploadthing/client";
import MultiSelect from "~/components/MultiSelect/MultiSelect";
import { FormStateType } from "~/pages";

interface SearchProps {
  formsSate: FormStateType;
  queryParamsCount: number;
  setFormsState: (state: FormStateType) => void;
}

const Search: FC<SearchProps> = ({
  formsSate,
  queryParamsCount,
  setFormsState,
}) => {
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <div className="w-[22rem] rounded-2xl border-2 border-gray-300 bg-gray-100 p-0.5 shadow md:w-auto">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <div className="w-full min-w-[200px] md:w-auto">
            <MultiSelect
              id="product-category"
              isOneSelect
              isCustom
              selected={formsSate.selectedCategories}
              options={ALL_OPTIONS}
              setSelected={(strArray) => {
                setFormsState({
                  ...formsSate,
                  selectedCategories: strArray,
                });
                void router.push({
                  pathname: "/",
                  query: {
                    ...router.query,
                    category: strArray.join(","),
                  },
                });
              }}
            />
          </div>
          <div>
            <Datepicker
              toggleClassName="hidden"
              displayFormat={"DD/MM/YYYY"}
              inputClassName="rounded-none pl-3 focus:ring-0 md:w-64 w-[21.45rem] font-semibold text-sm h-10 text-gray-800 text-center"
              value={formsSate.availableDates}
              onChange={(newValue) => {
                setFormsState({
                  ...formsSate,
                  availableDates: newValue,
                });
                void router.push({
                  pathname: "/",
                  query: {
                    ...router.query,
                    end_date: newValue?.endDate?.toString(),
                    start_date: newValue?.startDate?.toString(),
                  },
                });
              }}
            />
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={() => {
                setFormsState({
                  selectedCategories: [],
                  availableDates: {
                    endDate: null,
                    startDate: null,
                  },
                });
                void router.push("/");
              }}
              className={classNames(
                queryParamsCount === 0 ? "text-gray-400" : "text-gray-800",
                "w-full whitespace-nowrap rounded-b-xl bg-white px-4 py-2.5 text-sm font-semibold md:rounded-r-xl md:rounded-bl-none",
              )}
            >
              Noņemt filtrus ({queryParamsCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
