import Image from "next/image";
import { type FC } from "react";
import ImageLoader from "~/utils/ImageLoader";

interface ProfileAvatarProps {
  name: string;
  src: string | undefined | null;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ src, name }) => {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={28}
          height={28}
          loader={ImageLoader}
          className="h-9 w-9 rounded-full"
        />
      ) : (
        name
      )}
    </>
  );
};

export default ProfileAvatar;
