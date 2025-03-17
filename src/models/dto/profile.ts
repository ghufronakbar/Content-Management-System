import { User } from "@prisma/client";
import { PLACEHOLDER } from "~/constants/image";

export interface ProfileDTO {
  name: string;
  username: string;
  description: string;
  title: string;
}

export const initProfileDTO: ProfileDTO = {
  name: "",
  username: "",
  description: "",
  title: "",
};

export const initUser: User = {
  name: "",
  username: "",
  email: "",
  image: PLACEHOLDER,
  description: "",
  role: "User",
  title: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  provider: "local",
  id: "",
  password: "",
};
