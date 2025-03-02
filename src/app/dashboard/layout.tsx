import { Metadata } from "next";
import ChildLayout from "./child-layout";
import { FC } from "react";
import { serverSession } from "~/services/auth";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dashboard | Socio Point",
  description: "",
};

const DashboardLayout: FC<Props> = async ({ children }) => {
  await serverSession();
  return <ChildLayout>{children}</ChildLayout>;
};

export default DashboardLayout;
