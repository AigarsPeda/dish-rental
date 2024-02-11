import { useEffect, useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";

const TWO_MB = 2 * 1024 * 1024;

export type InputStatus = "Idle" | "Loading" | "Error" | "Success";
export type FileErrorType =
  | "fileSize"
  | "fileType"
  | "Something went wrong"
  | null;

const useImageUploadThing = () => {
  const [fileError, setFileError] = useState<FileErrorType>(null);
  const [inputStatus, setInputStatus] = useState<InputStatus>("Idle");

  const { startUpload, permittedFileInfo } = useUploadThing("imageUpload", {
    onClientUploadComplete: () => {
      // handelFileUpload([]);
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

      // check if the file is a jpg
      if (file.type !== "image/jpeg") {
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
    fileError,
    checkFiles,
    inputStatus,
    permittedFileInfo,
    handelStartUpload,
  };
};

export default useImageUploadThing;
