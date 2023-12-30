"use client"
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Audio } from "react-loader-spinner";
const getData = async () => {
  const res = await fetch("https://blog-tareq.vercel.app/api/posts", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed");
  }
  return res.json();
};

function Category() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getData();
        setData(result);
        setLoading(false)
        // Set initial filtered data (show all)
        setFilteredData(result.filter((d) => d?.status === true));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  const handleFilter = (cat) => {
    if (cat === "all") {
      setFilteredData(data.filter((d) => d?.status === true));
    } else {
      setFilteredData(data.filter((d) => d?.category === cat && d?.status === true));
    }
    setActiveFilter(cat);
  };

  if (loading) {
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
  return (
    <div className="md:py-28 container mx-auto md:px-10">
         <div className="flex md:justify-start justify-center flex-wrap md:flex-nowrap gap-3 md:gap-2 border-b text-md text-gray-600 text-center border-gray-400 pb-1 mx-2 md:mx-0">
        <button onClick={() => handleFilter("all")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "all" ? 'bg-black text-white' : ''}`}>All</button>
        <button onClick={() => handleFilter("CSS")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "CSS" ? 'bg-black text-white' : ''}`}>CSS</button>
        <button onClick={() => handleFilter("JavaScript")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "JavaScript" ? 'bg-black text-white' : ''}`}>JS</button>
        <button onClick={() => handleFilter("React")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "React" ? 'bg-black text-white' : ''}`}>React</button>
        <button onClick={() => handleFilter("Next.js")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "Next.js" ? 'bg-black text-white' : ''}`}>Next.js</button>
        <button onClick={() => handleFilter("Node.js")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "Node.js" ? 'bg-black text-white' : ''}`}>Node.js</button>
        <button onClick={() => handleFilter("Database")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "Database" ? 'bg-black text-white' : ''}`}>Database</button>
        <button onClick={() => handleFilter("Other")} className={`px-2 md:px-8 text-center rounded py-1 ${activeFilter === "Other" ? 'bg-black text-white' : ''}`}>Others</button>
        {/* Add more buttons for other categories */}
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:mx-0 mx-6 my-10">
        {filteredData &&
          filteredData.slice(0, 6).map((d) => (
            <BlogCard
              key={d.id}
              blog={d}
            />
          ))}
      </div>
    </div>
  );
}

export default Category;
