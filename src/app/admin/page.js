/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Pagination from "@/components/Pagination";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useSWR from "swr";
import { Audio } from "react-loader-spinner";


const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }
  return data;
};

function page() {
  const { isLoading, mutate, data: postedData } = useSWR(`https://blog-tareq.vercel.app/api/posts`, fetcher);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(postedData?.length / itemsPerPage);

  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = postedData?.slice(startIndex, endIndex);
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Audio
          height="30"
          width="30"
          radius="9"
          color="green"
          ariaLabel="loading"
        />
      </div>
    );
  }
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleStatusUpdate = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Publish it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://blog-tareq.vercel.app/api/posts/${item?.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: true }),
            }
          );
          if (res.ok) {
            Swal.fire({
              title: "Publish!",
              text: "Blog Published Successfully.",
              icon: "success",
            });
            // router.push("/dashboard");
          } else {
            toast.error("Failed to update blog");
          }
        } catch (error) {
          console.error("Error updating blog:", error);
          toast.error("Something went wrong");
        }
      }
    });
  };
  const handleFeatureUpdate = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://blog-tareq.vercel.app/api/posts/${item?.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ features: true }),
            }
          );
           
          if (res.ok) {
            Swal.fire({
              title: "Changed!",
              text: "Feature Changed Successfully.",
              icon: "success",
            });
            // router.push("/dashboard");
          } else {
            toast.error("Failed to Changed ");
          }
        } catch (error) {
          console.error("Error Changed:", error);
          toast.error("Something went wrong");
        }
      }
    });
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://blog-tareq.vercel.app/api/posts/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ features: true }),
          });
          console.log(res);
          if (res.ok) {
            Swal.fire({
              title: "Changed!",
              text: "Deleted Successfully.",
              icon: "success",
            });
            // router.push("/dashboard");
          } else {
            toast.error("Failed to Delete ");
          }
        } catch (error) {
          console.error("Error Delete:", error);
          toast.error("Something went wrong");
        }
      }
    });
  };
  return (
    <div className="container mx-auto">
      {status === "authenticated" ? (
        <div>
          <div className="flex justify-center py-4">
            <div className="">
              <div className="flex justify-center">
                <Image
                  src={session?.user.image}
                  alt=""
                  className="rounded-full"
                  width={70}
                  height={70}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-center">
                  {session?.user?.name}
                </h1>
                <p className="text-lg text-center">{session?.user?.email}</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl text-center pt-5 font-bold">
            All Written Blog
          </h2>
          <div className="overflow-x-auto flex justify-center py-10">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">SL</th>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">view</th>
                    <th className="py-2 px-4 border-b">Category</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Edit</th>
                    <th className="py-2 px-4 border-b">Features</th>
                    <th className="py-2 px-4 border-b">Delete</th>
                    <th className="py-2 px-4 border-b">Preview</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedData && displayedData.length > 0 ? (
                    displayedData.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">
                          {item?.title.slice(0, 30)}
                        </td>
                        <td className="py-2 px-4 border-b">{item?.views}</td>
                        <td className="py-2 px-4 border-b">{item?.category}</td>
                        <td
                          className={`py-2 px-4 border-b ${
                            item?.status ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {item?.status ? "Published" : "Pending"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className="btn"
                            onClick={() => handleStatusUpdate(item)}
                          >
                            Action
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className={`btn ${
                              item?.features ? "bg-green-300" : "bg-red-300"
                            } `}
                            onClick={() => handleFeatureUpdate(item)}
                          >
                            Feature
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className="py-1 border border-red-500 px-1 rounded-md"
                            onClick={() => handleDelete(item?.id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <Link
                            href={`/blog/${item?.slug}`}
                            className="text-blue-500 px-2 py-1"
                          >
                            Preview
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-red-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-40">
          <p className="text-center text-red-500 text-2xl">
            You are not Authenticated ! <br /> 😒😒😒
          </p>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default page;
