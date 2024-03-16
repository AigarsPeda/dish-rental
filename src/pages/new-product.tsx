import { ALL_OPTIONS, LOCAL_STORAGE_KEYS } from "hardcoded";
import { type NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";
import DropZone from "~/components/DropZone/DropZone";
import MultiSelect from "~/components/MultiSelect/MultiSelect";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import SignInModal from "~/components/SignInModal/SignInModal";
import Spinner from "~/components/Spinner/Spinner";
import TextInput from "~/components/TextInput/TextInput";
import Textarea from "~/components/Textarea/Textarea";
import Toggle from "~/components/Toggle/Toggle";
import useLocalStorage from "~/hooks/useLocalStorage";
import useRedirect from "~/hooks/useRedirect";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";

type FormStateType = {
  name: string;
  price: number;
  titleImage: string;
  description: string;
  isPublished: boolean;
  availablePieces: number;
  selectedCategories: string[];
  availableDates: DateValueType;
};

const NewPost: NextPage = () => {
  const { redirectToPath } = useRedirect();
  // const { data: sessionData } = useSession();
  const [images, setImages] = useState<File[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isNeedToSignIn, setIsNeedToSignIn] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
  // const { response, fileError, checkFiles, inputStatus, handelStartUpload } =
  //   useImageUploadThing();
  // const { mutate } = api.product.create.useMutation({
  //   onSuccess: (result) => {
  //     setFormsState({
  //       name: "",
  //       price: 0,
  //       titleImage: "",
  //       description: "",
  //       isPublished: true,
  //       availablePieces: 0,
  //       selectedCategories: ["trauki"],
  //       availableDates: {
  //         startDate: new Date(),
  //         endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  //       },
  //     });
  //     setIsFormLoading(false);
  //     redirectToPath(`/product/${result.postId}`);
  //   },
  // });

  const [formsSate, setFormsState] = useLocalStorage<FormStateType>(
    LOCAL_STORAGE_KEYS.productForm,
    {
      name: "",
      price: 0,
      titleImage: "",
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
      titleImage: "",
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

  // formData.append(key, payload[k], `${k}.${watermarkType}`);

  const uploadProfileImage = async (file: File[], form: FormStateType) => {
    const formData = new FormData();

    file.forEach((f) => {
      formData.append("image", f, f.name);
    });

    formData.append("name", form.name);
    formData.append("price", form.price.toString());
    formData.append("titleImage", form.titleImage);
    formData.append("isPublished", form.isPublished.toString());
    formData.append("description", form.description);
    formData.append("categories", form.selectedCategories.join(","));
    formData.append("availablePieces", form.availablePieces.toString());
    formData.append(
      "availableDatesStart",
      new Date(form.availableDates?.startDate ?? new Date())
        .getTime()
        .toString(),
    );
    formData.append(
      "availableDatesEnd",
      new Date(form.availableDates?.endDate ?? new Date()).getTime().toString(),
    );

    const response = await fetch("/api/upload/new-product", {
      method: "POST",
      body: formData,
      headers: {
        // "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json
      },
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      redirectToPath(`/product/${json.postId}`);
    }
  };

  // useEffect(() => {
  //   if (response.length === 0) return;

  //   console.log("response", response);

  //   setImages([]);

  //   void mutate({
  //     name: formsSate.name,
  //     imagesData: response,
  //     price: formsSate.price,
  //     titleImage: formsSate.titleImage,
  //     isPublished: formsSate.isPublished,
  //     description: formsSate.description,
  //     categories: formsSate.selectedCategories,
  //     availablePieces: formsSate.availablePieces,
  //     availableDatesStart: new Date(
  //       formsSate.availableDates?.startDate ?? new Date(),
  //     ),
  //     availableDatesEnd: new Date(
  //       formsSate.availableDates?.endDate ?? new Date(),
  //     ),
  //   });
  // }, [response]);

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
              void uploadProfileImage(images, formsSate);
              // if (isFormEmpty || isImagesEmpty) {
              //   setIsShowErrorMessage(true);
              //   return;
              // }

              // if (inputStatus === "Loading" ?? isFormLoading) return;

              // if (!sessionData) {
              //   void setIsNeedToSignIn(true);
              //   return;
              // }

              // setIsFormLoading(true);
              // void handelStartUpload(images);
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
                        // disabledDates={[
                        //   {
                        //     startDate: new Date(
                        //       new Date().setDate(new Date().getDate() - 1),
                        //     ),
                        //     endDate: new Date(
                        //       new Date().setFullYear(
                        //         new Date().getFullYear() - 20,
                        //       ),
                        //     ),
                        //   },
                        // ]}
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
                          <button
                            type="button"
                            key={file.name}
                            className={classNames(
                              file.name === formsSate.titleImage &&
                                "ring-2 ring-gray-900",
                              "relative h-20 w-20 overflow-hidden rounded-md transition-all hover:ring-2 hover:ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900",
                            )}
                            onClick={() => {
                              setFormsState({
                                ...formsSate,
                                titleImage: file.name,
                              });
                            }}
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
                            {file.name === formsSate.titleImage && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                                <p className="text-xs font-semibold text-white">
                                  Titulbilde
                                </p>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <DropZone
                        isMultiple
                        images={images}
                        fileError={null}
                        checkFiles={() => {
                          console.log("checkFiles");
                        }}
                        inputStatus={"Idle"}
                        handelFileUpload={(fileArray) => {
                          console.log(fileArray);
                          setImages(fileArray);
                          setFormsState({
                            ...formsSate,
                            titleImage: fileArray[0]?.name ?? "",
                          });
                        }}
                      />
                    </div>
                    <div>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        JPG līdz 4.5MB. Maksimums 4 attēli.
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
