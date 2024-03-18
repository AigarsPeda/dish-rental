import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion, type Variants } from "framer-motion";
import { ALL_OPTIONS } from "hardcoded";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  IoCheckmarkSharp,
  IoHammerOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Datepicker from "react-tailwindcss-datepicker";
import DeleteImageModal from "~/components/DeleteImageModal/DeleteImageModal";
import DropZone from "~/components/DropZone/DropZone";
import MultiSelect from "~/components/MultiSelect/MultiSelect";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import Textarea from "~/components/Textarea/Textarea";
import TextInput from "~/components/TextInput/TextInput";
import Toggle from "~/components/Toggle/Toggle";
import { type DBImageType } from "~/types/product.schema";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";
import getFilesError, { type FileErrorType } from "~/utils/getFilesError";
import ImageLoader from "~/utils/ImageLoader";
import compressImage from "../../../utils/compressImage";

const variants: Variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: "-100%", position: "absolute" },
};

type FormDataType = {
  id: number;
  name: string;
  price: number;
  newImages: File[];
  titleImage: string;
  description: string;
  isPublished: boolean;
  categories: string[];
  availablePieces: number;
  imagesData: DBImageType[];
  availableDatesEnd: number;
  availableDatesStart: number;
};

type ChangingStatus = "idle" | "changing" | "changed" | "error";

export type ImageToDeleteType = {
  key: string;
  imgSrc: string;
} | null;

const EditPage: NextPage = () => {
  const router = useRouter();
  const [parent] = useAutoAnimate();
  const { data: sessionData } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileError, setFileError] = useState<FileErrorType>(null);
  const [imageToDelete, setImageToDelete] = useState<ImageToDeleteType>(null);
  const [changingStatus, setChangingStatus] = useState<ChangingStatus>("idle");

  const { data, isLoading } = api.product.getById.useQuery(
    { id: router.query.id as string },
    { enabled: Boolean(router.query.id) },
  );

  const [formData, setFormData] = useState<FormDataType>({
    id: 0,
    name: "",
    price: 0,
    newImages: [],
    categories: [],
    titleImage: "",
    imagesData: [],
    description: "",
    isPublished: false,
    availablePieces: 0,
    availableDatesEnd: 0,
    availableDatesStart: 0,
  });
  const utils = api.useUtils();
  const { mutate: updateProduct } = api.product.updateProduct.useMutation({
    onSuccess: () => {
      setChangingStatus("changed");
    },
    onMutate: () => {
      setChangingStatus("changing");
    },
  });

  const { mutate: deleteImage } = api.product.deleteImage.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      setImageToDelete(null);
      setChangingStatus("changed");
      void utils.product.getById.invalidate({ id: router.query.id as string });
    },
    onMutate: () => {
      setIsDeleting(true);
      setChangingStatus("changing");
    },
  });

  const uploadProfileImage = async (file: File[], form: FormDataType) => {
    if (!sessionData) {
      return;
    }

    const formData = new FormData();
    const compressedImages = await Promise.all(
      file.map((f) => compressImage(f)),
    );

    compressedImages.forEach((f) => {
      formData.append("image", f, f.name);
    });

    formData.append("name", form.name);
    formData.append("userId", sessionData.user.id);
    formData.append("titleImage", form.titleImage);
    formData.append("price", form.price.toString());
    formData.append("description", form.description);
    formData.append("categories", form.categories.join(","));
    formData.append("isPublished", form.isPublished.toString());
    formData.append("availablePieces", form.availablePieces.toString());
    formData.append(
      "availableDatesStart",
      new Date(form.availableDatesStart ?? new Date()).getTime().toString(),
    );
    formData.append(
      "availableDatesEnd",
      new Date(form.availableDatesEnd ?? new Date()).getTime().toString(),
    );

    const response = await fetch("/api/upload/upload-images", {
      method: "POST",
      body: formData,
      headers: {
        credentials: "include",
        action: "update-product",
        origin: window.location.origin,
      },
    });

    if (response.ok) {
      const json = (await response.json()) as { postId: string };

      console.log("json", json);
    }
  };

  useEffect(() => {
    if (data) {
      setFormData((state) => ({
        ...state,
        id: data.id,
        price: data.price,
        name: data.name ?? "",
        imagesData: data.images,
        isPublished: data.isPublished,
        categories: data.categories ?? [],
        titleImage: data.titleImage ?? "",
        description: data.description ?? "",
        availablePieces: data.availablePieces,
        availableDatesEnd: data.availableDatesEnd,
        availableDatesStart: data.availableDatesStart,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (changingStatus === "changed") {
      const timeout = setTimeout(() => {
        setChangingStatus("idle");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [changingStatus]);

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
                void updateProduct({
                  id: formData.id,
                  name: formData.name ?? "",
                  price: formData.price ?? 0,
                  isPublished: formData.isPublished,
                  titleImage: formData.titleImage ?? "",
                  categories: formData.categories ?? [],
                  description: formData.description ?? "",
                  availablePieces: formData.availablePieces,
                  availableDatesEnd: formData.availableDatesEnd,
                  availableDatesStart: formData.availableDatesStart,
                });
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
                        value={formData?.name ?? ""}
                        onChange={(str) => {
                          setFormData((state) => ({
                            ...state,
                            name: str,
                          }));
                        }}
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
                        selected={formData?.categories ?? []}
                        options={ALL_OPTIONS}
                        setSelected={(strArray) => {
                          setFormData((state) => ({
                            ...state,
                            categories: strArray,
                          }));
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
                          value={formData?.description ?? ""}
                          onChange={(str) => {
                            setFormData((state) => ({
                              ...state,
                              description: str,
                            }));
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
                          value={formData?.price ?? 0}
                          onChange={(value) => {
                            setFormData((state) => ({
                              ...state,
                              price: value,
                            }));
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
                          value={formData?.availablePieces ?? 0}
                          onChange={(value) => {
                            setFormData((state) => ({
                              ...state,
                              availablePieces: value,
                            }));
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
                          isChecked={formData?.isPublished ?? false}
                          handleChange={() => {
                            setFormData((state) => ({
                              ...state,
                              isPublished: !state.isPublished,
                            }));
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
                          value={{
                            startDate: new Date(
                              formData?.availableDatesStart ?? "",
                            ),
                            endDate: new Date(
                              formData?.availableDatesEnd ?? "",
                            ),
                          }}
                          onChange={(newValue) => {
                            setFormData((state) => ({
                              ...state,
                              availableDatesStart: new Date(
                                newValue?.startDate ?? "",
                              ).getTime(),
                              availableDatesEnd: new Date(
                                newValue?.endDate ?? "",
                              ).getTime(),
                            }));
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
                      <div
                        ref={parent}
                        className="mb-2 flex flex-wrap justify-center gap-2"
                      >
                        {formData.imagesData.map((file, i) => (
                          <div className="relative" key={`${file.name}-${i}`}>
                            <button
                              type="button"
                              className={classNames(
                                file.name === formData?.titleImage &&
                                  "ring-2 ring-gray-900",
                                "relative h-20 w-20 overflow-hidden rounded-md transition-all hover:ring-2 hover:ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900",
                              )}
                              onClick={() => {
                                setFormData((state) => ({
                                  ...state,
                                  titleImage: file.name,
                                }));
                              }}
                            >
                              <Image
                                priority
                                width={0}
                                height={0}
                                src={file.url}
                                alt={file.name}
                                loader={ImageLoader}
                                style={{
                                  width: "120px",
                                  height: "auto",
                                  objectFit: "cover",
                                }}
                              />
                              {file.name === formData?.titleImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                                  <p className="text-xs font-semibold text-white">
                                    Titulbilde
                                  </p>
                                </div>
                              )}
                            </button>
                            {file.name !== formData?.titleImage && (
                              <button
                                type="button"
                                className="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-white p-1"
                                onClick={() => {
                                  setImageToDelete({
                                    key: file.key,
                                    imgSrc: file.url,
                                  });
                                }}
                              >
                                <IoTrashOutline className="h-4 w-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        ))}
                        <DeleteImageModal
                          isDeleting={isDeleting}
                          imageToDelete={imageToDelete}
                          handleModalClose={() => {
                            setImageToDelete(null);
                          }}
                          handleImageDelete={() => {
                            if (!imageToDelete?.key) return;

                            void deleteImage({
                              key: imageToDelete?.key,
                              postId: data?.id ?? 0,
                            });
                          }}
                        />
                      </div>
                      <DropZone
                        isMultiple
                        inputStatus={"Idle"}
                        fileError={fileError}
                        checkFiles={(fileArray) =>
                          setFileError(
                            getFilesError(fileArray, data?.images.length ?? 0),
                          )
                        }
                        images={formData?.newImages ?? []}
                        handelFileUpload={(fileArray) => {
                          setFormData((state) => ({
                            ...state,
                            newImages: fileArray,
                          }));
                        }}
                      />
                      <div>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                          JPG līdz 4.5MB. Maksimums 4 attēli.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-10 w-full"></div>
              <div className="flex items-center justify-end gap-x-6">
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
                    "relative flex h-11 w-40 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-gray-50 transition-all",
                  )}
                >
                  <motion.div
                    variants={variants}
                    initial="closed"
                    animate={changingStatus === "idle" ? "open" : "closed"}
                    className="absolute flex h-full w-full items-center justify-center gap-2 rounded-md bg-gray-800"
                  >
                    <span>Labot</span>
                  </motion.div>

                  <motion.div
                    variants={variants}
                    initial="closed"
                    animate={changingStatus === "changing" ? "open" : "closed"}
                    className="absolute flex h-full w-full items-center justify-center gap-2 rounded-md bg-yellow-500"
                  >
                    <IoHammerOutline className="h-6 w-6" />

                    <span>Labo...</span>
                  </motion.div>

                  <motion.div
                    variants={variants}
                    initial="closed"
                    animate={changingStatus === "changed" ? "open" : "closed"}
                    className="absolute flex h-full w-full items-center justify-center gap-2 rounded-md bg-green-500"
                  >
                    <IoCheckmarkSharp className="h-6 w-6" />

                    <span>Izlabots</span>
                  </motion.div>
                </button>
              </div>
            </form>
          </div>
        </main>
      </main>
    </>
  );
};

export default EditPage;
