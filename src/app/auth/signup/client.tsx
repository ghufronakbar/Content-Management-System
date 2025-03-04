"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { BsGoogle } from "react-icons/bs";
import { signUp } from "~/services/auth";
import { initSignUpDTO, SignUpDTO } from "~/models/dto/auth";
import { useRouter } from "next/navigation";

const SignUpPageClient = () => {
  const [form, setForm] = useState<SignUpDTO>(initSignUpDTO);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(form, router);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        className="border border-neutral-200 rounded-lg p-4 flex flex-col gap-4 w-[90%] md:w-[80%] lg:w-[60%] xl:w-[30%] px-8 py-8 bg-white shadow-lg"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <label htmlFor="name" className="text-sm -mb-2">
          Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
          className="w-full h-fit px-4 py-2 rounded-lg border border-neutral-200 text-sm"
        />
        <label htmlFor="email" className="text-sm -mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="some@example.com"
          className="w-full h-fit px-4 py-2 rounded-lg border border-neutral-200 text-sm"
        />
        <label htmlFor="password" className="text-sm -mb-2">
          Password
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder=""
          className="w-full h-fit px-4 py-2 rounded-lg border border-neutral-200 text-sm"
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm tracking-wider w-full h-fit"
          type="submit"
        >
          Sign Up
        </button>
        <div className="w-full h-[1px] bg-neutral-200" />
        <button
          className="bg-white text-primary px-4 py-2 rounded-lg font-medium cursor-pointer text-sm tracking-wider w-full h-fit flex flex-row gap-2 items-center border border-neutral-200 justify-center"
          onClick={() => signIn("google")}
        >
          <BsGoogle />
          Sign Up with Google
        </button>
        <p className="text-sm text-center self-center mt-4">
          Already have an account?{" "}
          <span>
            <Link href="/auth/signin" className="text-primary">
              Sign In
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPageClient;
