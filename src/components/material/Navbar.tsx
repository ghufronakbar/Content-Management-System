import Image from "next/image";
import Link from "next/link";
import { LOGO } from "~/constants/image";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <Link href="/">
          <Image
            src={LOGO}
            alt=""
            width={200}
            height={200}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-lg hover:text-primary transform transition-transform duration-300 ease-in-out hover:scale-105">
            About
          </div>
          <Link
            href="/article"
            className="text-lg text-primary transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Read
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
