import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "~/components/PageHead/PageHead";
import Spinner from "~/components/Spinner/Spinner";
import TextInput from "~/components/TextInput/TextInput";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";

const EditPage: NextPage = () => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = api.post.getById.useQuery(
    { id: postId ?? 1 },
    { enabled: postId !== null },
  );

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      const id = parseInt(router.query.id, 10);
      setPostId(id);
    }
  }, [router.query.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHead
        title={"Trauku noma | Labot sludinājumu"}
        descriptionLong={"Nomā vai iznomā traukus"}
        descriptionShort={"Nomā vai iznomā traukus"}
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
          <div className="flex w-full items-center justify-center text-center">
            <form
              className="mx-auto mt-4 w-full max-w-xl px-2 pb-10"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="w-full space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Labot sludinājumu
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <TextInput
                        name="Nosaukums"
                        value={data?.name ?? ""}
                        onChange={(e) => console.log(e)}
                      />
                    </div>
                    {/* <div className="sm:col-span-6">
                      <label
                        htmlFor="product-category"
                        className="mb-2 block font-medium leading-6 text-gray-900"
                      >
                        Produkta kategorija
                      </label>
                      <MultiSelect
                        id="product-category"
                        selected={formsSate.selectedCategories}
                        options={ALL_OPTIONS}
                        setSelected={(strArray) => {
                          setFormsState({
                            ...formsSate,
                            selectedCategories: strArray,
                          });
                        }}
                      />
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Maksimums 3 kategorijas.
                      </p>
                    </div> */}

                    {/* <div className="col-span-full">
                      <label
                        htmlFor="product-description"
                        className="block font-medium leading-6 text-gray-900"
                      >
                        Apraksts
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          id="product-description"
                          name="product-description"
                          className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formsSate.description}
                          onChange={(e) => {
                            setFormsState({
                              ...formsSate,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Neliels apraksts par jūsu produktu.
                      </p>
                    </div> */}

                    {/* <div className="col-span-full">
                      <DropZone
                        fileError={fileError}
                        inputStatus={inputStatus}
                        checkFiles={checkFiles}
                        images={images}
                        handelFileUpload={(fileArray) => {
                          setImages(fileArray);
                        }}
                      />
                    </div> */}
                    {/* 
                    <div className="mx-auto max-w-40 sm:col-span-2">
                      <label
                        htmlFor="product-price"
                        className="block font-medium leading-6 text-gray-900"
                      >
                        Cena € / dienā
                      </label>
                      <div className="mt-2">
                        <NumberInput
                          isDecimal
                          id="product-price"
                          value={formsSate.price}
                          onChange={(value) => {
                            setFormsState({
                              ...formsSate,
                              price: value,
                            });
                          }}
                        />
                      </div>
                    </div> */}

                    {/* <div className="mx-auto max-w-40 sm:col-span-2">
                      <label
                        htmlFor="product-available-pieces"
                        className="block font-medium leading-6 text-gray-900"
                      >
                        Pieejamas vienības
                      </label>
                      <div className="mt-2">
                        <NumberInput
                          id="product-available-pieces"
                          value={formsSate.availablePieces}
                          onChange={(value) => {
                            setFormsState({
                              ...formsSate,
                              availablePieces: value,
                            });
                          }}
                        />
                      </div>
                    </div> */}

                    {/* <div className="mx-auto max-w-40 sm:col-span-2">
                      <label
                        htmlFor="product-available-pieces"
                        className="block font-medium leading-6 text-gray-900"
                      >
                        Publicēts
                      </label>
                      <div className="mt-4">
                        <Toggle
                          isChecked={formsSate.isPublished}
                          handleChange={() => {
                            setFormsState({
                              ...formsSate,
                              isPublished: !formsSate.isPublished,
                            });
                          }}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* <SignInModal
                  isNeedToSignIn={isNeedToSignIn}
                  setIsNeedToSignIn={setIsNeedToSignIn}
                /> */}
              </div>
              {/* <div className="flex h-10 items-center justify-center">
                {isShowErrorMessage && (
                  <p className=" text-sm leading-5 text-red-600">
                    Lūdzu, aizpildiet visus laukus un pievienojiet vismaz vienu
                    attēlu.
                  </p>
                )}
              </div> */}
              <div className=" flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => {
                    console.log("cancel");
                  }}
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className={classNames(
                    isLoading
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-500",
                    "relative rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600",
                  )}
                >
                  {isLoading ? <Spinner size="sm" /> : "Izveidot"}
                </button>
              </div>
            </form>
          </div>
        </main>
        {/* <h1 className="px-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Labot sludinājumu
        </h1>
        <div className="flex w-full items-center justify-center text-center">
          <form
            className="mx-auto mt-4 max-w-xl px-2 pb-10"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <TextInput
                  name="Nosaukums"
                  value={data?.name ?? ""}
                  onChange={(e) => console.log(e)}
                />
              </div>
            </div>
          </form>
        </div> */}
      </main>
    </>
  );
};

export default EditPage;
