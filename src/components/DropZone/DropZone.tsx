import { type FC } from "react";
import { IoAdd, IoCheckmarkSharp } from "react-icons/io5";
import Spinner from "src/components/Spinner/Spinner";
import { type InputStatus } from "~/hooks/useImageUploadThing";
import classNames from "~/utils/classNames";
import { type FileErrorType } from "~/utils/getFilesError";

interface DropZoneProps {
  images: File[];
  isMultiple?: boolean;
  fileError: FileErrorType;
  inputStatus: InputStatus;
  handleStartUpload?: () => void;
  checkFiles: (files: File[]) => void;
  handelFileUpload: (images: File[]) => void;
}

const DropZone: FC<DropZoneProps> = ({
  images,
  fileError,
  isMultiple,
  inputStatus,
  checkFiles,
  handelFileUpload,
  handleStartUpload,
}) => {
  return (
    <>
      <div className="relative flex justify-center rounded-lg border-gray-900/25">
        <div className="flex text-center">
          <div className="flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="cover-photo"
              className="mx-auto flex h-20 w-20 cursor-pointer items-center justify-center rounded-md bg-gray-300 px-2 font-semibold text-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-600 focus-within:ring-offset-2 hover:text-gray-50"
            >
              {inputStatus !== "Loading" && (
                <span>
                  <IoAdd className="h-10 w-10" />
                </span>
              )}
              {inputStatus === "Loading" && (
                <span>
                  <Spinner size="sm" />
                </span>
              )}

              <input
                type="file"
                id="cover-photo"
                name="cover-photo"
                multiple={isMultiple}
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
                {inputStatus === "Success" && (
                  <span className="flex items-center justify-center gap-2">
                    Success
                    <IoCheckmarkSharp />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        {!fileError && images.length > 0 && !handleStartUpload && (
          <div
            className={classNames(
              inputStatus === "Idle" && "cursor-pointer text-gray-600",
              inputStatus === "Loading" && "cursor-not-allowed text-gray-600",
              inputStatus === "Success" && "cursor-not-allowed text-green-300",
              "relative z-50 flex w-32 items-center justify-center rounded-md  px-4 py-2 text-sm ",
            )}
          >
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
          <p className="text-xs leading-5 text-red-600">Something went wrong</p>
        )}

        {fileError === "Too many files" && (
          <p className="text-xs leading-5 text-red-600">
            Pārāk daudz failu. Atļauti tikai 4 attēli. Izdēsiet kādu no vecajiem
            attēliem, vai izvēlieties mazāk attēlus.
          </p>
        )}
      </div>
    </>
  );
};

export default DropZone;
