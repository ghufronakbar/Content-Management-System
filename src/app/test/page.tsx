"use client";

import { useSession } from "next-auth/react";

const TestPage = () => {
  const { data } = useSession();

  if (!data) {
    return <div>You are not logged in</div>;
  }

  const { user } = data;

  return <div className="text-2xl mt-40">{JSON.stringify(user)}</div>;
};

export default TestPage;
