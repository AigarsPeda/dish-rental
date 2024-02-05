import { type FC } from "react";

interface ProfileAvatarProps {
  name: string;
  src: string | undefined | null;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ src, name }) => {
  return (
    <>
      {src ? (
        <img className="h-7 w-7 rounded-full" src={src} alt={name} />
      ) : (
        name
      )}
    </>
  );
};

export default ProfileAvatar;
