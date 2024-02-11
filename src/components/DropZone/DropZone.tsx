import { type FC } from "react";
import Spinner from "src/components/Spinner/Spinner";
import { classNames } from "uploadthing/client";
import {
  type FileErrorType,
  type InputStatus,
} from "~/hooks/useImageUploadThing";
import { IoCheckmarkSharp } from "react-icons/io5";

interface DropZoneProps {
  images: File[];
  fileError: FileErrorType;
  inputStatus: InputStatus;
  handleStartUpload?: () => void;
  checkFiles: (files: File[]) => void;
  handelFileUpload: (images: File[]) => void;
}

const DropZone: FC<DropZoneProps> = ({
  images,
  fileError,
  inputStatus,
  checkFiles,
  handelFileUpload,
  handleStartUpload,
}) => {
  return (
    <div className="col-span-full">
      <label
        htmlFor="cover-photo"
        className="block font-medium leading-6 text-gray-900"
      >
        Produkta attēli
      </label>
      <div className="relative mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>

          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="w-32 cursor-pointer rounded-md bg-white px-2 font-semibold text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              {inputStatus !== "Loading" && <span>Upload a file</span>}
              {inputStatus === "Loading" && <span>Uploading...</span>}
              {/* {inputStatus === "Success" && <span>Success</span>} */}

              <input
                multiple
                type="file"
                id="file-upload"
                name="file-upload"
                disabled={inputStatus === "Loading"}
                onDrop={(e) => {
                  e.preventDefault();
                  const fileArray = Array.from(e.dataTransfer.files);
                  checkFiles(fileArray);
                  handelFileUpload(fileArray);
                }}
                className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-transparent  opacity-0 "
                onChange={(e) => {
                  if (e.target.files) {
                    const fileArray = Array.from(e.target.files);
                    checkFiles(fileArray);
                    handelFileUpload(fileArray);
                  }
                }}
              />
            </label>

            {inputStatus !== "Loading" ? (
              <p className="pl-1">or drag and drop</p>
            ) : null}
          </div>

          <div className="flex items-center justify-center py-2">
            {!fileError && images.length > 0 && handleStartUpload && (
              <button
                type="button"
                onClick={handleStartUpload}
                disabled={inputStatus === "Loading"}
                className={classNames(
                  inputStatus === "Idle" && "cursor-pointer text-gray-50",
                  inputStatus === "Loading" &&
                    "cursor-not-allowed text-gray-50",
                  inputStatus === "Success" &&
                    "cursor-not-allowed text-green-300",
                  "relative z-50 flex w-32 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm ",
                )}
              >
                {inputStatus === "Idle" && `Upload ${images.length} files`}
                {inputStatus === "Loading" && <Spinner size="sm" />}
                {inputStatus === "Success" && (
                  <span className="flex items-center justify-center gap-2">
                    Success
                    <IoCheckmarkSharp />
                  </span>
                )}
              </button>
            )}

            {!fileError && images.length > 0 && !handleStartUpload && (
              <div
                className={classNames(
                  inputStatus === "Idle" && "cursor-pointer text-gray-600",
                  inputStatus === "Loading" &&
                    "cursor-not-allowed text-gray-600",
                  inputStatus === "Success" &&
                    "cursor-not-allowed text-green-300",
                  "relative z-50 flex w-32 items-center justify-center rounded-md  px-4 py-2 text-sm ",
                )}
              >
                {inputStatus === "Idle" && `Upload ${images.length} files`}
                {inputStatus === "Loading" && <Spinner size="sm" />}
                {inputStatus === "Success" && (
                  <span className="flex items-center justify-center gap-2">
                    Success
                    <IoCheckmarkSharp />
                  </span>
                )}
              </div>
            )}

            {fileError === "fileSize" && (
              <p className="text-xs leading-5 text-red-600">
                File size is too large
              </p>
            )}

            {fileError === "fileType" && (
              <p className="text-xs leading-5 text-red-600">
                File type is not supported
              </p>
            )}

            {fileError === "Something went wrong" && (
              <p className="text-xs leading-5 text-red-600">
                Something went wrong
              </p>
            )}
          </div>
          <p className="text-xs leading-5 text-gray-600">JPG up to 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
