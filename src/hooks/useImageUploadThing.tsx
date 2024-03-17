import Compressor from "compressorjs";
import { useEffect, useState } from "react";
import { type ImageDataType } from "~/types/product.schema";
import { type FileErrorType } from "~/utils/getFilesError";
import { useUploadThing } from "~/utils/uploadthing";

const FOUR_AND_HALF_MB = 4.5 * 1024 * 1024;

export type InputStatus = "Idle" | "Loading" | "Error" | "Success";

const useImageUploadThing = () => {
  const [response, setResponse] = useState<ImageDataType[]>([]);
  const [fileError, setFileError] = useState<FileErrorType>(null);
  const [inputStatus, setInputStatus] = useState<InputStatus>("Idle");

  const { startUpload, permittedFileInfo } = useUploadThing("imageUpload", {
    onClientUploadComplete: (res: ImageDataType[]) => {
      setResponse(res);
      setInputStatus("Success");
    },
    onUploadError: () => {
      setInputStatus("Error");
      setFileError("Something went wrong");
    },
    onUploadBegin: () => {
      setInputStatus("Loading");
    },
  });

  const checkFiles = (files: File[]) => {
    for (const file of files) {
      // check if the file is larger than 2MB
      if (file.size > FOUR_AND_HALF_MB) {
        setFileError("fileSize");
        return;
      }

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      ) {
        setFileError("fileType");
        return;
      }

      setFileError(null);
    }
  };

  const handelStartUpload = async (images: File[]) => {
    if (inputStatus === "Loading" ?? images.length === 0) return;

    try {
      const compressedImages = await Promise.all(images.map(compressImage));
      setInputStatus("Loading");
      void startUpload(compressedImages);
    } catch (error) {
      console.error(error);
    }
  };

  const compressImage = (image: File) => {
    return new Promise<File>((resolve, reject) => {
      new Compressor(image, {
        quality: 0.6,
        maxWidth: 1920,
        success(result) {
          const compressedFile = new File([result], image.name, {
            type: image.type,
          });
          resolve(compressedFile);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  useEffect(() => {
    if (inputStatus === "Success") {
      const timeout = setTimeout(() => {
        setInputStatus("Idle");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [inputStatus]);

  return {
    response,
    fileError,
    checkFiles,
    inputStatus,
    permittedFileInfo,
    handelStartUpload,
  };
};

export default useImageUploadThing;
