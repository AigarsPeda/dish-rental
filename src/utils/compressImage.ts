import Compressor from "compressorjs";

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

export default compressImage;
