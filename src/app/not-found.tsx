import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "404 Not Found | Socio Engineer",
};

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-2 justify-center items-center">
      <Image
        src="/images/404.png"
        width={500}
        height={500}
        alt="404"
        className="h-96 w-auto"
      />
      <div className="md:text-2xl lg:text-5xl font-semibold">
        You&apos;re lost
      </div>
      <div className="md:text-md lg:text-lg">
        Return to{" "}
        <Link href="/" className="text-primary">
          Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
