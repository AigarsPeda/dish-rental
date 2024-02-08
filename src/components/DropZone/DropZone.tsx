import { useSession } from "next-auth/react";
import { useState, type FC } from "react";
import { useUploadThing } from "~/utils/uploadthing";

interface DropZoneProps {
  handleSignIn: () => void;
}

const DropZone: FC<DropZoneProps> = ({ handleSignIn }) => {
  const { data: sessionData } = useSession();
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUpload", {
    onClientUploadComplete: () => {
      setFiles([]);
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      alert("upload has begun");
    },
  });

  return (
    <div className="col-span-full">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Cover photo
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
              className="cursor-pointer rounded-md bg-white px-2 font-semibold text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>

              <input
                multiple
                type="file"
                id="file-upload"
                name="file-upload"
                onDrag={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!sessionData) {
                    handleSignIn();
                    return;
                  }
                  setFiles(Array.from(e.dataTransfer.files));
                }}
                onClick={(e) => {
                  if (!sessionData) {
                    e.preventDefault();
                    handleSignIn();
                    return;
                  }
                }}
                className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-transparent  opacity-0 "
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
              />
            </label>

            <p className="pl-1">or drag and drop</p>
          </div>
          <div className="py-2">
            {files.length > 0 && (
              <button
                type="button"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm text-gray-50 "
                onClick={() => startUpload(files)}
              >
                Upload {files.length} files
              </button>
            )}
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
