"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          <div className="m-4 text-white">Signed in as {session.user.name}</div>
          <button
            className={`w-40
            justify-self-center
            p-1 mb-4
            bg-gray-800 text-green-500
            border border-green-500 rounded
            hover:bg-white hover:text-yellow-500`}
            onClick={() => router.push("/")}
          >
            Go to Home
          </button>
          <button
            className={`w-40
            justify-self-center
            p-1 mb-4
            bg-gray-800 text-green-500
            border border-green-500 rounded
            hover:bg-white hover:text-yellow-500`}
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="grid m-auto text-center">
          <div className="m-4 text-white">Not signed in</div>
          <button
            className={`w-40
            justify-self-center
            p-1 mb-4
            bg-gray-800 text-green-500
            border border-green-500 rounded
            hover:bg-white hover:text-yellow-500`}
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
