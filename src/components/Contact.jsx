import React from "react";

function Contact() {
  
  return (
    <div className="h-[200px] relative flex justify-center bg-black">
      <div className="bg-green-50 md:flex justify-between items-center gap-20 p-10 absolute -top-32 md:h-[250px] md:w-4/5 rounded-xl">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold">Drop A line!</h2>
          <p className="py-3 text-gray-500 text-justify px-1">
          Feel free to drop a line about your blog, and I will do my best to provide any assistance or information you are looking for. Whether it is a specific question, a description of your blog content, or anything else you would like to share, go ahead!
          </p>
        </div>
        <div>
          <button className="bg-green-400 px-3 cursor-pointer py-1 text-md rounded">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
