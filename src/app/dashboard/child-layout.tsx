"use client";

import { FC } from "react";
import SidebarApp from "~/components/material/SidebarApp";

interface Props {
  children: React.ReactNode;
}

const ChildLayout: FC<Props> = ({ children }) => {
  return (
    <main className="w-full min-h-screen">
      <SidebarApp>{children}</SidebarApp>
    </main>
  );
};

export default ChildLayout;
