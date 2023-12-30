import React from 'react'

function Subscribe() {
  return (
    <div className="bg-green-100 h-[350px] py-10 md:py-20 md:h-[300px] justify-center md:flex items-center">
      <div className="md:w-3/5 text-center">
        <h1 className="text-3xl font-semibold">Subscribe Blog For Latest Updates</h1>
        <p className="text-md text-gray-500 py-2 px-6 md:px-24">
        By subscribing to our blog, you will gain exclusive access to a wealth of information that spans a diverse range of subjects.</p>
          <div>
        <div className="mt-2 mx-3">
        <input type="text" className='border-2 px-4 py-1 rounded-md w-56' placeholder="Enter Your Email adress" />
        <button className="bg-green-300 px-3 ml-2 py-1 rounded md:mt-0 mt-2">Subscribe Now</button>
        </div>
        <p className="text-sm pt-4 text-gray-500">Look no further! Our blog is your go-to destination for a curated collection of insightful articles</p>
      </div>
      </div>
      
    </div>
  )
}

export default Subscribe