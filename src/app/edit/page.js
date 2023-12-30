"use client";
import app from "@/utils/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProgressBar from "react-progressbar";
import 'react-quill/dist/quill.snow.css';
 
const DynamicQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})
const getData = async (search) => {
  const res = await fetch(`https://blog-tareq.vercel.app/api/posts/${search}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed");
  }
  return res.json();
};

function Write() {
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const [media, setMedia] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const storage = getStorage(app);

  const searchParams = useSearchParams();
  const search = searchParams.get("slug");

  useEffect(() => {
    // Wrap the useEffect code in a check for the browser environment
    if (typeof window !== 'undefined') {
      const ReactQuill = require('react-quill');
      require('react-quill/dist/quill.snow.css');
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      // Wrap the code fetching data in a check for the browser environment
      if (typeof window !== 'undefined') {
        try {
          const result = await getData(search);
          setEditData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    const upload = () => {
      const name = new Date().getTime() + selectedFile.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);

          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {},
        () => {
          //  https://firebasestorage.googleapis.com
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };
    selectedFile && upload();
  }, [selectedFile,storage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!editData?.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editData?.summary.trim()) {
      toast.error("Summary is required");
      return;
    }

    if (editData?.category === "Select Category") {
      toast.error("Please select a category");
      return;
    }

    if (!editData?.desc.trim()) {
      toast.error("Content is required");
      return;
    }

    // if (!selectedFile) {
    //   toast.error("Please select a file");
    //   return;
    // }

    const time = Number(editData?.readTime);

    const updateData = {
      title: editData.title,
      summary: editData.summary,
      readTime: time,
      category: editData.category,
      desc: editData.desc,
      img: media,
    };

    try {
      const res = await fetch(
        `https://blog-tareq.vercel.app/api/posts/${editData?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      if (res.ok) {
        toast.success("Blog updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="container mx-auto py-10">
      <div className="mx-20">
        <div>
          <input
            value={editData?.title}
            type="text"
            placeholder="Title"
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="placeholder:text-3xl py-4 w-full outline-none text-4xl bg-green-50"
          />
          <textarea
            type="text"
            value={editData?.summary}
            placeholder="Write blog summary within 200 letters"
            onChange={(e) =>
              setEditData({ ...editData, summary: e.target.value })
            }
            className="placeholder: text-gray-600 py-2 w-full outline-none text-md bg-green-50"
          />
          <input
            type="number"
            value={editData?.readTime}
            placeholder="Enter read time"
            onChange={(e) =>
              setEditData({ ...editData, readTime: e.target.value })
            }
            className="placeholder:text-xl py-2 w-full outline-none text-xl bg-green-50"
          />

          <div className="flex gap-4">
            <select
              id="filter"
              name="filter"
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              value={editData?.category}
              placeholder="Category"
              className="placeholder:text-xl italic py-4 px-2 outline-none text-lg bg-green-50"
            >
              {[
                "Select Category",
                "JavaScript",
                "React",
                "Next.js",
                "Node.js",
                "Database",
                "Other",
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="fileInput"
                className="block text-sm font-medium cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Display the selected file name, if any */}
              {selectedFile && (
                <p className="text-sm text-gray-500 pl-4">
                  {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <ProgressBar
            completed={uploadProgress}
            bgColor="#6EE7B7"
            labelAlignment="center"
            height="10px"
          />
        </div>

        {selectedFile && (
          <span className="ml-2 mb-2">{`${uploadProgress.toFixed(2)}%`}</span>
        )}
        <DynamicQuill
          theme="snow"
          value={editData?.desc}
          onChange={(content) => setEditData({ ...editData, desc: content })}
          placeholder="Publish  your blog...."
        />

        <button
          disabled={status === "unauthenticated"}
          onClick={handleSubmit}
          className="bg-green-400 mt-6 px-3  cursor-pointer py-1 text-md rounded"
        >
          Publish
        </button>
      </div>
    </div>
  );
}

export default Write;
