import { ALL_OPTIONS } from "hardcoded";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { classNames } from "uploadthing/client";
import MultiSelect from "~/components/MultiSelect/MultiSelect";

type FormStateType = {
  selectedCategories: string[];
  availableDates: DateValueType;
};

const Search: FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [formsSate, setFormsState] = useState<FormStateType>({
    selectedCategories: [],
    availableDates: {
      startDate: null,
      endDate: null,
    },
  });

  useEffect(() => {
    if (router.query.category && typeof router.query.category === "string") {
      const category = router.query.category.split(",");
      setCategories(category);
    } else {
      setCategories([]);
    }
  }, [router.query.category]);

  return (
    <div className="flex w-full justify-center">
      <div className="rounded-2xl border-2 border-gray-300 bg-gray-100 p-0.5 shadow">
        <div className="flex items-center justify-end gap-1">
          <div className="">
            <Datepicker
              displayFormat={"DD/MM/YYYY"}
              inputClassName="rounded-l-xl pl-3 focus:ring-0 w-64 font-semibold text-sm h-10 text-gray-800 px-2"
              value={formsSate.availableDates}
              onChange={(newValue) => {
                setFormsState({
                  ...formsSate,
                  availableDates: newValue,
                });
              }}
            />
          </div>
          <div>
            <MultiSelect
              id="product-category"
              isOneSelect
              selected={formsSate.selectedCategories}
              options={ALL_OPTIONS}
              setSelected={(strArray) => {
                setFormsState({
                  ...formsSate,
                  selectedCategories: strArray,
                });
              }}
            />
          </div>
          <div>
            <button
              onClick={() => router.push(`/`)}
              className={classNames(
                categories.length === 0 ? "text-gray-400" : "text-gray-800",
                "whitespace-nowrap rounded-r-xl bg-white px-3 py-2.5 text-sm font-semibold ",
              )}
            >
              Noņemt filtrus ({categories.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
