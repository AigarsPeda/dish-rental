import { useEffect, useState } from "react";
import { ImageDataType } from "~/types/post.schema";
import { useUploadThing } from "~/utils/uploadthing";

const TWO_MB = 2 * 1024 * 1024;

export type InputStatus = "Idle" | "Loading" | "Error" | "Success";
export type FileErrorType =
  | null
  | "fileSize"
  | "fileType"
  | "Something went wrong";

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
      if (file.size > TWO_MB) {
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

  const handelStartUpload = (images: File[]) => {
    if (inputStatus === "Loading" || images.length === 0) return;

    setInputStatus("Loading");
    startUpload(images);
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
