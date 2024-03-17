const FOUR_AND_HALF_MB = 4.5 * 1024 * 1024;

export type FileErrorType =
  | null
  | "fileSize"
  | "fileType"
  | "Too many files"
  | "Something went wrong";

const getFilesError = (files: File[], dbImageLength: number): FileErrorType => {
  const length = files.length + dbImageLength;
  if (length > 4) {
    return "Too many files";
  }

  for (const file of files) {
    if (file.size > FOUR_AND_HALF_MB) {
      return "fileSize";
    }

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      return "fileType";
    }
  }

  return null;
};

export default getFilesError;
