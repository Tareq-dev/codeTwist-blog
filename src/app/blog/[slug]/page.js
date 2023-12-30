import Comments from "@/components/Comments";
import Image from "next/image";

const getData = async (slug) => {
  const res = await fetch(`https://blog-tareq.vercel.app/api/posts/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed");
  }
  return res.json();
};

export default async function BlogDetails({ params }) {
  const { slug } = params;
  const data = await getData(slug);
  const originalDate = data?.createdAt;
  const date = new Date(originalDate);
  // console.log(data);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return (
    <div className="container flex justify-center mx-auto">
      <div className="w-4/5 py-12">
        <div>
          {data.img && (
            <Image
              width={500}
              height={500}
              className="w-[600px] h-[400px] rounded-xl mb-4"
              src={data?.img}
              alt=""
            />
          )}
          <h1 className="text-3xl pt-6">{data?.title}</h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-sm py-2">{formattedDate}</p>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <p className="text-gray-400 text-sm">
                {" "}
                Views {data?.views} times
              </p>
            </div>
          </div>

          <div className="pb-6">
            <p className=" text-gray-400 pb-2">Posted by</p>
            <div className="flex items-center gap-3">
              <Image
                width={40}
                height={40}
                className="rounded-full"
                src={data?.user?.image}
                alt=""
              />
              <div>
                <p className="text-md pl-2">{data?.user?.name}</p>
                <p className="text-sm pl-2">{data?.user?.email}</p>
              </div>
            </div>
          </div>
          <div className=" text-justify pb-10">
            <div
             dangerouslySetInnerHTML={{ __html: data?.desc || '' }}
              className="w-[800px] py-2"
            />
          </div>
          <Comments postSlug={slug} />
        </div>
      </div>
    </div>
  );
}
