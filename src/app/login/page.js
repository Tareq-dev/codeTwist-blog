"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="flex justify-center items-center h-[400px]">
      <div className="bg-gray-200 p-12 rounded-xl">
        <button
          onClick={() => signIn("google")}
          className="flex justify-center items-center bg-white px-4 py-1 rounded-lg"
        >
          {/* {status === "loading" && <p className="text-center">Loading...</p>} */}
          <Image
            src="/gmail.svg"
            alt="gmail-logo"
            width={50}
            height={50}
          />
          <p className="block text-black">
            Sign in with Google
          </p>
        </button>
      </div>
    </div>
  );
}
