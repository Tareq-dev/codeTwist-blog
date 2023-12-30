"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";

const getData = async () => {
  const res = await fetch("https://blog-tareq.vercel.app/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

function PaginatedBlog() {
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 
  const itemsPerPage = 6;
  const pageCount = Math.ceil(postData?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = postData?.slice(startIndex, endIndex);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        const filterData = data?.filter((d) => d?.status === true);
        setPostData(filterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Add logic to fetch data for the new page if needed
  };

  return (
    <div className="md:py-28 container mx-auto md:px-10">
      <div className="grid md:grid-cols-3 gap-8 my-10 mx-6 border-b pb-20">
        {displayedData &&
          displayedData?.map((d) => (
            <BlogCard
              key={d.id}
              blog={d}
            />
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default PaginatedBlog;
