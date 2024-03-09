import { ALL_OPTIONS } from "hardcoded";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import DropZone from "~/components/DropZone/DropZone";
import MultiSelect from "~/components/MultiSelect/MultiSelect";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import Spinner from "~/components/Spinner/Spinner";
import TextInput from "~/components/TextInput/TextInput";
import Textarea from "~/components/Textarea/Textarea";
import Toggle from "~/components/Toggle/Toggle";
import useImageUploadThing from "~/hooks/useImageUploadThing";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";

const EditPage: NextPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [postId, setPostId] = useState<number | null>(null);
  const { response, fileError, checkFiles, inputStatus, handelStartUpload } =
    useImageUploadThing();
  const { data, isLoading } = api.product.getById.useQuery(
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
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="product-category"
                        className="mb-2 block font-medium leading-6 text-gray-900"
                      >
                        Produkta kategorija
                      </label>
                      <MultiSelect
                        id="product-category"
                        selected={data?.categories ?? []}
                        options={ALL_OPTIONS}
                        setSelected={(strArray) => {
                          console.log(strArray);
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
                          value={data?.description ?? ""}
                          onChange={(str) => console.log(str)}
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
                          value={data?.price ?? 0}
                          onChange={(value) => {
                            console.log(value);
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
                          value={data?.availablePieces ?? 0}
                          onChange={(value) => {
                            console.log(value);
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
                          isChecked={data?.isPublished ?? false}
                          handleChange={() => {
                            console.log("toggle");
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
                              data?.availableDatesStart ?? "",
                            ),
                            endDate: new Date(data?.availableDatesEnd ?? ""),
                          }}
                          onChange={(newValue) => {
                            console.log(newValue);
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
                          {data?.images.map((file) => (
                            <button
                              type="button"
                              key={file.name}
                              className={classNames(
                                file.name === data?.titleImage &&
                                  "ring-2 ring-gray-900",
                                "relative h-20 w-20 overflow-hidden rounded-md transition-all hover:ring-2 hover:ring-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900",
                              )}
                              onClick={() => {
                                console.log("set title image");
                              }}
                            >
                              <Image
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
                              {file.name === data?.titleImage && (
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
              </div>

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
