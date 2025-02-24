import Image from "next/image";
import { LOGO } from "~/constants/image";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col px-4 md:px-12 lg:px-18 py-20 gap-4 mt-20">
      <div className="w-full flex flex-row justify-between items-center">
        <Image
          src={LOGO}
          alt=""
          width={200}
          height={200}
          className="h-8 w-auto"
        />
        <div className="flex flex-row gap-4">
          <p className="text-black font-medium cursor-pointer">
            socioengineer.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
