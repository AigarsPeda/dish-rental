import { ALL_OPTIONS } from "hardcoded";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";
import { classNames } from "uploadthing/client";
import DropZone from "~/components/DropZone/DropZone";
import MultiSelect from "~/components/MultiSelect/MultiSelect";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import SignInModal from "~/components/SignInModal/SignInModal";
import Spinner from "~/components/Spinner/Spinner";
import TextInput from "~/components/TextInput/TextInput";
import Textarea from "~/components/Textarea/Textarea";
import Toggle from "~/components/Toggle/Toggle";
import useImageUploadThing from "~/hooks/useImageUploadThing";
import useLocalStorage from "~/hooks/useLocalStorage";
import useRedirect from "~/hooks/useRedirect";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";

type FormStateType = {
  name: string;
  price: number;
  description: string;
  isPublished: boolean;
  availablePieces: number;
  selectedCategories: string[];
  availableDates: DateValueType;
};

const NewPost: NextPage = () => {
  const { redirectToPath } = useRedirect();
  const { data: sessionData } = useSession();
  const [images, setImages] = useState<File[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isNeedToSignIn, setIsNeedToSignIn] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
  const { response, fileError, checkFiles, inputStatus, handelStartUpload } =
    useImageUploadThing();
  const { mutate } = api.product.create.useMutation({
    onSuccess: (result) => {
      setFormsState({
        name: "",
        price: 0,
        description: "",
        isPublished: true,
        availablePieces: 0,
        selectedCategories: ["trauki"],
        availableDates: {
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
      setIsFormLoading(false);
      redirectToPath(`/product/${result.postId}`);
    },
  });

  const [formsSate, setFormsState] = useLocalStorage<FormStateType>(
    "new-product-form-v2",
    {
      name: "",
      price: 0,
      description: "",
      isPublished: true,
      availablePieces: 0,
      selectedCategories: ["trauki"],
      availableDates: {
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    },
  );

  const isImagesEmpty = images.length === 0;
  const isFormEmpty = Object.values(formsSate).some((value) => value === "");

  const resetState = () => {
    setFormsState({
      name: "",
      price: 0,
      description: "",
      isPublished: true,
      availablePieces: 0,
      selectedCategories: ["trauki"],
      availableDates: {
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });
    setImages([]);
  };

  // try to get new-product-form from local storage and delete it if it exists
  useEffect(() => {
    localStorage.removeItem("new-product-form");
  }, []);

  useEffect(() => {
    if (response.length === 0) return;

    setImages([]);

    void mutate({
      name: formsSate.name,
      imagesData: response,
      price: formsSate.price,
      isPublished: formsSate.isPublished,
      description: formsSate.description,
      categories: formsSate.selectedCategories,
      availablePieces: formsSate.availablePieces,
      availableDatesStart: new Date(
        formsSate.availableDates?.startDate ?? new Date(),
      ),
      availableDatesEnd: new Date(
        formsSate.availableDates?.endDate ?? new Date(),
      ),
    });
  }, [response]);

  return (
    <>
      <PageHead
        title="Trauku noma | Izveidot jaunu sludinājumu"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <div className="flex w-full items-center justify-center text-center">
          <form
            className="mx-auto mt-4 max-w-xl px-4 pb-10"
            onSubmit={(e) => {
              e.preventDefault();
              if (isFormEmpty || isImagesEmpty) {
                setIsShowErrorMessage(true);
                return;
              }

              if (inputStatus === "Loading" ?? isFormLoading) return;

              if (!sessionData) {
                void setIsNeedToSignIn(true);
                return;
              }

              setIsFormLoading(true);
              void handelStartUpload(images);
            }}
          >
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Izveidojiet jaunu sludinājumu
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Šī informācija būs redzama citiem lietotājiem. Lūdzu,
                  pārliecinieties, ka viss ir pareizi.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <TextInput
                      name="Nosaukums"
                      value={formsSate.name}
                      onChange={(e) => setFormsState({ ...formsSate, name: e })}
                    />
                  </div>
                  <div className="sm:col-span-6">
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
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="product-description"
                      className="block font-medium leading-6 text-gray-900"
                    >
                      Apraksts
                    </label>
                    <div className="mt-2">
                      <Textarea
                        value={formsSate.description}
                        onChange={(str) => {
                          setFormsState({
                            ...formsSate,
                            description: str,
                          });
                        }}
                      />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      Neliels apraksts par jūsu produktu.
                    </p>
                  </div>

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
                  </div>
                  <div className="mx-auto max-w-40 sm:col-span-2">
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
                  </div>
                  <div className="mx-auto max-w-40 sm:col-span-2">
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
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="product-available-pieces"
                      className="block font-medium leading-6 text-gray-900"
                    >
                      Pieejamības datumi
                    </label>
                    <div className="mt-4">
                      <Datepicker
                        displayFormat={"DD/MM/YYYY"}
                        value={formsSate.availableDates}
                        onChange={(newValue) => {
                          setFormsState({
                            ...formsSate,
                            availableDates: newValue,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <div>
                      <label
                        htmlFor="cover-photo"
                        className="mb-4 block font-medium leading-6 text-gray-900"
                      >
                        Produkta attēli
                      </label>
                    </div>
                    <div className="flex justify-center gap-2">
                      <div className="flex flex-wrap justify-center gap-2">
                        {images.map((file) => (
                          <div
                            key={file.name}
                            className="relative h-20 w-20 overflow-hidden rounded-md"
                          >
                            <Image
                              width={0}
                              height={0}
                              alt={file.name}
                              loader={ImageLoader}
                              src={URL.createObjectURL(file)}
                              style={{
                                width: "120px",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <DropZone
                        images={images}
                        fileError={fileError}
                        checkFiles={checkFiles}
                        inputStatus={inputStatus}
                        handelFileUpload={(fileArray) => {
                          setImages(fileArray);
                        }}
                      />
                    </div>
                    <div>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        JPG līdz 2MB. Maksimums 4 attēli.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <SignInModal
                isNeedToSignIn={isNeedToSignIn}
                setIsNeedToSignIn={setIsNeedToSignIn}
              />
            </div>
            <div className="flex h-10 items-center justify-center">
              {isShowErrorMessage && (
                <p className=" text-sm leading-5 text-red-600">
                  Lūdzu, aizpildiet visus laukus un pievienojiet vismaz vienu
                  attēlu.
                </p>
              )}
            </div>
            <div className=" flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={resetState}
                disabled={isFormLoading}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Atcelt
              </button>
              <button
                type="submit"
                className={classNames(
                  isFormEmpty || isImagesEmpty || isFormLoading
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-500",
                  "relative rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600",
                )}
              >
                {isFormLoading ? <Spinner size="sm" /> : "Izveidot"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default NewPost;

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }

// const LoginLogOutButton = () => {
//   const { data: sessionData } = useSession();

//   return (
//     <div className="flex items-center">
//       <p className="text-center text-gray-900">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//       </p>
//       <button
//         className="px-10 py-2 font-semibold text-gray-900 no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Izlogoties " : "Ielogoties"}
//       </button>
//     </div>
//   );
// };

const Button = () => {
  const { data: sessionData } = useSession();

  return (
    <button
      className="px-10 py-2 font-semibold text-gray-900 no-underline transition hover:bg-white/20"
      onClick={() => console.log("clicked")}
    >
      {sessionData ? "Izlogoties " : "Ielogoties"}
    </button>
  );
};
