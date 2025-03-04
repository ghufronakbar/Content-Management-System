"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_PROFILE, LOGO } from "~/constants/image";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  let lastScrollY = 0;

  // Menambahkan efek scroll untuk hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          // scroll ke bawah, sembunyikan navbar
          setShowNavbar(false);
        } else {
          // scroll ke atas, tampilkan navbar
          setShowNavbar(true);
        }
        lastScrollY = window.scrollY;
      }
    };

    // Tambahkan event listener scroll
    window.addEventListener("scroll", handleScroll);

    // Hapus event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname.includes("dashboard")) return null;

  return (
    <nav
      className={`bg-white shadow-md fixed top-0 left-0 right-0 transition-transform duration-300 ease-in-out z-50 ${
        showNavbar ? "transform translate-y-0" : "-translate-y-full"
      }`}
    >
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
          <div
            className="relative flex flex-row gap-2 items-center cursor-pointer"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onClick={() => {
              if (status === "unauthenticated") router.push("/auth/signin");
            }}
          >
            <div>
              {status === "loading"
                ? "Loading..."
                : session?.user?.name || "Sign In"}
            </div>
            <Image
              src={session?.user?.image || DEFAULT_PROFILE}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
            />
            {visible && status === "authenticated" && (
              <div className="absolute top-6 right-0 px-4 py-2 bg-transparent">
                <div className="bg-white border border-neutral-200 px-2 py-1 rounded-lg flex flex-col gap-2">
                  <Link
                    className="border-b border-neutral-200 px-2 cursor-pointer"
                    href="/dashboard/article"
                  >
                    Dashboard
                  </Link>
                  <div
                    className="border-b border-neutral-200 px-2 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: pathname })}
                  >
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
