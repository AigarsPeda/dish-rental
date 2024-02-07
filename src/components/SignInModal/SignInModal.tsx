import { signIn } from "next-auth/react";
import { type FC } from "react";
import Modal from "~/components/Modal/Modal";

interface SignInModalProps {
  isNeedToSignIn: boolean;
  setIsNeedToSignIn: (value: boolean) => void;
}

const SignInModal: FC<SignInModalProps> = ({
  isNeedToSignIn,
  setIsNeedToSignIn,
}) => {
  return (
    <Modal
      isModalOpen={isNeedToSignIn}
      handleModalClose={() => {
        setIsNeedToSignIn(false);
      }}
    >
      <div className="w-full border-b border-gray-900/10 p-6 pb-12">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          Lai izveidotu jaunu sludinājumu, jums ir jāielogojas.
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600 ">
          Ielogojoties jūs varat izmantot kādu no sociālajiem kontiem. Jūsu dati
          netiks izmantoti citiem mērķiem.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => {
              void signIn();
              void setIsNeedToSignIn(false);
            }}
            className="rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Ielogoties
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignInModal;
