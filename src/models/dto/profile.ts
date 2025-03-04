import { User } from "@prisma/client";
import { PLACEHOLDER } from "~/constants/image";

export interface ProfileDTO {
  name: string;
  username: string;
  description: string;
}

export const initProfileDTO: ProfileDTO = {
  name: "",
  username: "",
  description: "",
};

export const initUser: User = {
  name: "",
  username: "",
  email: "",
  image: PLACEHOLDER,
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  provider: "local",
  id: "",
  password: "",
};
