"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsGoogle } from "react-icons/bs";
import { toast } from "react-toastify";
import { optToast } from "~/utils/toast";

const SignInPageClient = () => {
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Signing in...", {
      ...optToast,
      type: "info",
      position: "bottom-right",
    });
    const form = e.currentTarget;
    const data = new FormData(form);
    const signInRes = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInRes?.error) {
      toast("Invalid email or password", {
        ...optToast,
        type: "error",
        position: "bottom-right",
      });
    }

    if (signInRes?.ok) {
      toast("Signed in successfully", {
        ...optToast,
        type: "success",
        position: "bottom-right",
      });
      router.push(signInRes.url || "/");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        className="border border-neutral-200 rounded-lg p-4 flex flex-col gap-4 w-[90%] md:w-[80%] lg:w-[60%] xl:w-[30%] px-8 py-8 bg-white shadow-lg"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold">Sign In</h1>
        <label htmlFor="email" className="text-sm -mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="some@example.com"
          className="w-full h-fit px-4 py-2 rounded-lg border border-neutral-200 text-sm"
          name="email"
        />
        <label htmlFor="password" className="text-sm -mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder=""
          className="w-full h-fit px-4 py-2 rounded-lg border border-neutral-200 text-sm"
          name="password"
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm tracking-wider w-full h-fit"
          type="submit"
        >
          Sign In
        </button>
        <div className="w-full h-[1px] bg-neutral-200" />
        <button
          className="bg-white text-primary px-4 py-2 rounded-lg font-medium cursor-pointer text-sm tracking-wider w-full h-fit flex flex-row gap-2 items-center border border-neutral-200 justify-center"
          onClick={() => signIn("google")}
          type="button"
        >
          <BsGoogle />
          Sign In with Google
        </button>
        <p className="text-sm text-center self-center mt-4">
          Don&apos;t have an account?{" "}
          <span>
            <Link href="/auth/signup" className="text-primary">
              Sign Up
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignInPageClient;
