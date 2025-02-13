import { Metadata } from "next";
import { FC } from "react";
import { ToastContainer } from "react-toastify";
import SidebarApp from "~/components/material/SidebarApp";

export const metadata: Metadata = {
  title: "Dashboard | Socio Point",
  description: "Dashboard",
};

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <main className="w-full min-h-screen">
      <SidebarApp>{children}</SidebarApp>
      <ToastContainer />
    </main>
  );
};

export default DashboardLayout;
