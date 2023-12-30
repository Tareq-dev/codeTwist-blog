/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import Swal from "sweetalert2";
 
import toast from "react-hot-toast";
const getData = async () => {
  const res = await fetch("https://blog-tareq.vercel.app/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

function page() {
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const { data, status } = useSession();
  const email = data?.user?.email;
  const router = useRouter();
   
  const adminEmails = [
    "tarequl.islam0025@gmail.com",
    "tareque179@gmail.com",
    "tareque.dev@gmail.com",
  ];

  const isAdmin = adminEmails.includes(email);

  const role = isAdmin ? "admin" : "user";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (email) {
          const filterData = data?.filter((d) => d?.userEmail === email);
          setPostData(filterData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, status]);

  if (loading || status === "loading") {
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

  const handleEdit = (item) => {
    const itemSlug = item.slug;
    router.push(`https://blog-tareq.vercel.app/edit?slug=${itemSlug}`);
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
            body: JSON.stringify({ user: true }),
          });
          if (res.ok) {
            Swal.fire({
              title: "Changed!",
              text: "Deleted Successfully.",
              icon: "success",
            });
            router.refresh()
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
                  src={data?.user.image}
                  alt=""
                  className="rounded-full"
                  width={70}
                  height={70}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-center mt-1">
                  {data?.user?.name} {isAdmin && <span>(Admin)</span>}
                </h1>
                <p className="text-lg text-center">{data?.user?.email}</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl text-center pt-5 font-bold">
            My Published Blog
          </h2>
          <div className="overflow-x-auto flex justify-center py-10">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">view</th>
                    <th className="py-2 px-4 border-b">Category</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Edit</th>
                    <th className="py-2 px-4 border-b">Delete</th>
                    <th className="py-2 px-4 border-b">Preview</th>
                  </tr>
                </thead>

                <tbody>
                  {postData && postData.length > 0 ? (
                    postData.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="py-2 px-4 border-b">{item.title}</td>
                        <td className="py-2 px-4 border-b">{item.views}</td>
                        <td className="py-2 px-4 border-b">{item.category}</td>
                        <td  data-tip="It will publish after admin review"
                          className={`py-2 px-4 border-b ${
                            item.status ? "text-green-500" : "text-red-500 tooltip"
                          }`}
                        >
                          {item.status ? "Published" : "Pending"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleEdit(item)}
                            className="hover:bg-gray-300 px-2 py-1"
                          >
                            Edit
                          </button>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                              className="text-red-500 px-2 py-1"
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
    </div>
  );
}

export default page;
