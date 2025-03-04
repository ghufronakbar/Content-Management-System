import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "~/config/prisma";
import bcrypt from "bcryptjs";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "~/constants/auth";
import { redirect } from "next/navigation";
import { SignUpDTO } from "~/models/dto/auth";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { optToast } from "~/utils/toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) return null;
        const isMatch = await bcrypt.compare(password, user?.password || "");
        if (user && isMatch) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }): Promise<string> {
      return baseUrl + "/dashboard/article";
    },
    async signIn({ user, account }) {
      if (!user || !account) return false;
      if (!user.email) return false;
      const userExists = await prisma.user.findUnique({
        where: {
          email: user?.email,
        },
      });
      if (!userExists) {
        const { provider } = account;
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || `User ${user.id}`,
            image: user.image,
            provider: provider,
            username: user.email.split("@")[0].toLowerCase(),
          },
        });
      }
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const serverSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  return session;
};

export const signUp = async (dto: SignUpDTO, router: AppRouterInstance) => {
  try {
    if (!dto.name || !dto.email || !dto.password) {
      toast("Please fill all the fields", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
      return;
    }
    if (!dto.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      toast("Please enter a valid email", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
    }
    if (dto.password && dto.password.length < 6) {
      toast("Password must be at least 6 characters", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
    }
    toast("Signing up...", {
      ...optToast,
      type: "info",
      position: "bottom-right",
    });
    await axios.post("/api/signup", { data: dto });
    toast("User signed up successfully", {
      ...optToast,
      type: "success",
      position: "bottom-right",
    });
    router.push("/auth/signin");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast(error.response?.data || "Something went wrong", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
    } else if (error instanceof Error) {
      toast("Something went wrong", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
      console.error(error.message);
    }
  }
};

export const getUser = async () => {
  const { data } = await axios.get<User | null>("/api/user");
  return data;
};
