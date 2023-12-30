"use client";
import app from "@/utils/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProgressBar from "react-progressbar";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DynamicQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})
function Write() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [summary, setSummary] = useState("");
  const [media, setMedia] = useState("");
  const [selectedOption, setSelectedOption] = useState("Select Category");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { status } = useSession();
  const router = useRouter();
  const storage = getStorage(app);

  


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
  }, [storage,selectedFile]);

  const handleFileChange = (event) => {
    // Access the selected file from the event
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  const handleSubmit = async () => {
    // Validation checks
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!summary.trim()) {
      toast.error("Summary is required");
      return;
    }

    if (selectedOption === "Select Category") {
      toast.error("Please select a category");
      return;
    }

    if (!value.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const slug = generateSlug(title);

    const time = Number(readTime);
    const data = {
      title,
      category: selectedOption,
      desc: value,
      img: media,
      slug,
      summary,
      readTime: time,
    };

    const res = await fetch("https://blog-tareq.vercel.app/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setValue("");
      setTitle("");
      setSummary("");
      setReadTime(5);
      
      setSelectedOption("Select Category");
      setSelectedFile(null);
      setUploadProgress(0);
      toast.success("Successfully toasted!");
      router.push(`/blog/${slug}`);
    }
  };

  return (
    <div className="md:container md:mx-auto mx-4 py-6 md:py-10">
      <div>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="placeholder:text-3xl py-4 w-full outline-none text-2xl md:text-4xl bg-green-50"
        />
        <textarea
          type="text"
          placeholder="Write blog summary within 200 letters"
          onChange={(e) => setSummary(e.target.value)}
          className=" text-gray-600 py-2 w-full outline-none text-md bg-green-50"
        />
        <input
          type="number"
          placeholder="Enter read time"
          onChange={(e) => setReadTime(e.target.value)}
          className="placeholder:text-xl py-2 w-full outline-none text-xl bg-green-50"
        />

        <div className="flex gap-4">
          <select
            id="filter"
            name="filter"
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="Category"
            className="placeholder:text-xl italic py-4 px-2 outline-none text-lg bg-green-50"
          >
            {[
              "Select Category",
              "CSS",
              "JavaScript",
              "React",
              "Next.js",
              "Node.js",
              "Database",
              "Other",
            ].map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
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
              <p className="text-sm text-gray-500 pl-4">{selectedFile.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="md:w-1/3">
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
        value={value}
        onChange={setValue}
        placeholder="Publish  your blog...."
      />
      {status === "unauthenticated" && (
        <p className="text-red-500 mt-10 text-sm">
          You can not publish your blog before login.
          <Link
            href="/login"
            className="text-blue-500 underline pl-2"
          >
            Please Login
          </Link>
        </p>
      )}

      <button
        disabled={status === "unauthenticated"}
        onClick={handleSubmit}
        className="bg-green-400 mt-6 px-3  cursor-pointer py-1 text-md rounded"
      >
        Publish
      </button>
    </div>
  );
}

export default Write;
