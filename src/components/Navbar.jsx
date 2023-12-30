"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

function Navbar() {
  const { data, status } = useSession();

  const loginEmail = data?.user?.email;

  const adminEmails = [
    "tarequl.islam0025@gmail.com",
    "tareque179@gmail.com",
    "tareque.dev@gmail.com",
  ];

  const isAdmin = adminEmails.includes(loginEmail);

  const role = isAdmin ? "admin" : "user";

  return (
    <nav className="container mx-4 md:mx-auto md:px-10 flex justify-between h-20 items-center ">
      <Link
        href="/"
        className="text-2xl font-semibold font-serif"
      >
        Code<span className="text-white bg-green-500 px-1 rounded">Twist</span>
      </Link>

      <div className="mr-4 md:hidden">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md  dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-md w-36"
          >
            <li >
              <Link  className="text-lg"
                target="_blank"
                href="https://developer-tareq.netlify.app/"
              >
                My Portfolio
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/write">Write</Link>
            </li>
            <li>
              {status === "authenticated" && (
                <Link className="text-lg" href="/dashboard">Dashboard</Link>
              )}
            </li>

            {role === "admin" && (
              <li>
                <Link className="text-lg" href="/admin">Admin</Link>
              </li>
            )}
            {status === "authenticated" ? (
              <button
                onClick={() => signOut()}
                className="py-1 text-lg mr-8 hover:bg-green-200 rounded"
              >
                Log Out
              </button>
            ) : (
              <li className="py-1 text-lg mr-8 hover:bg-green-200 rounded">
                <Link href="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <ul className="md:flex gap-8 items-center text-md  hidden">
        <li>
          <Link
            target="_blank"
            href="https://developer-tareq.netlify.app/"
          >
            My Portfolio
          </Link>
        </li>
        <li>
          <Link href="/write">Write</Link>
        </li>
        <li>
          {status === "authenticated" && (
            <Link href="/dashboard">Dashboard</Link>
          )}
        </li>

        {role === "admin" && (
          <li>
            <Link href="/admin">Admin</Link>
          </li>
        )}
        {status === "authenticated" ? (
          <li className="py-1 px-2 hover:bg-green-200 rounded">
            <button onClick={() => signOut()}>Log Out</button>
          </li>
        ) : (
          <li className="py-1 px-2 hover:bg-green-200 rounded">
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
