import Image from "next/image";
import Link from "next/link";

function BlogCard({ blog }) {
  return (
    <div className="">
      <div className="relative">
        <Image
          className="rounded-lg h-[250px]"
          width={500}
          height={500}
          src={blog?.img}
          alt="html"
        />
        {blog?.features && (
          <p className="bg-green-500 top-4 -ml-2 rounded-l-sm rounded-r-lg absolute text-white font-semibold px-2 featured_card">
            Featured
          </p>
        )}
      </div>
      <div className="my-2 py-2 px-4 flex justify-between bg-green-50 rounded border">
        <h3 className="text-md font-semibold">{blog?.category}</h3>
        <p>{blog?.readTime}min Read</p>
      </div>
      <h2 className="text-xl font-bold pt-1 pb-1 h-[50px]">
        {blog?.title.slice(0, 70)}
      </h2>
      <p className="text-md text-gray-500 text-justify py-4">
        {blog?.summary.slice(0, 200)} ...
      </p>
      <Link
        href={`/blog/${blog?.slug}`}
        className="bg-green-300 px-3 cursor-pointer py-1 text-lg rounded"
      >
        Read full article
      </Link>
    </div>
  );
}

export default BlogCard;
