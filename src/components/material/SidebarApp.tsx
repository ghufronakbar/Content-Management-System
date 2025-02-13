"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "~/components/ui/sidebar";
import {
  IconArrowLeft,
  IconArticle,
  IconBrandTabler,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { DEFAULT_PROFILE, LOGO } from "~/constants/image";

const iconClassName = "text-neutral-700  h-5 w-5 flex-shrink-0";

const links: LinksProps[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconBrandTabler className={iconClassName} />,
  },
  {
    label: "Article",
    href: "/dashboard/article",
    icon: <IconArticle className={iconClassName} />,
  },
  {
    label: "Logout",
    href: "/",
    icon: <IconArrowLeft className={iconClassName} />,
  },
];

export default function SidebarApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200 overflow-hidden h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "socio@gmail.com",
                href: "/admin/profile",
                icon: (
                  <Image
                    src={DEFAULT_PROFILE}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={LOGO}
        width={50}
        height={50}
        alt="Avatar"
        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black  whitespace-pre"
      >
        Lestari
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={LOGO}
        width={50}
        height={50}
        alt="Avatar"
        className="h-5 w-6   rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover"
      />
    </Link>
  );
};

interface LinksProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}
