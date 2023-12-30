"use client"
import useSWR from "swr";
import { useSession } from 'next-auth/react';
import  Image from 'next/image';
import { useState } from 'react';
import  Link  from 'next/link';

const fetcher = async (url)=>{
  const res = await fetch(url)
  const data = await res.json()
  if(!res.ok){
  const error = new Error(data.message)
  throw error
  }
  return data;

}

function Comments({postSlug}) {
  const {status} = useSession()
  const [desc , setDesc] = useState("")
  const [err , setErr] = useState("")

  const {isLoading, mutate, data} = useSWR(`https://blog-tareq.vercel.app/api/comments?postSlug=${postSlug}`,fetcher)


const handleSubmit =async()=>{
  if(status === "unauthenticated"){
    setErr("Please Login first")
  }
  await fetch("/api/comments",{
    method:"POST",
    body:JSON.stringify({desc , postSlug})
  })
  mutate()
  setDesc("")
}

  return (
    <div className="py-4">
    <h4 className="mb-2">Comments</h4>
    {status === "unauthenticated" && <Link href="/login" className="text-blue-500 underline" >Login to write a comment</Link>}
    
    <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-4 block h-16 my-2 w-full rounded-md outline-none" placeholder="Leave your comment.."></textarea>
    {err && <p className="text-red-500 py-2">{err}</p>}
    <button  onClick={handleSubmit} className="bg-green-400 hover:bg-green-500 px-4 cursor-pointer py-1 text-md rounded">
      Send
    </button>
   {
    isLoading ? <span className="pl-2">loading...</span> : data?.map(item =>(
      <div  key={item.id}>
      <div className="flex gap-4 items-center pt-8">
        <Image width={500} height={500} className="h-12 w-12 rounded-full" src={item?.user?.image} alt="avatar"/>
        <div>
          <p className="text-lg">{item?.user?.name}</p>
          <p className="text-xs text-gray-500">{new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(item?.createdAt))}</p>
        </div>
      </div>
      <p className="text-md text-gray-500 py-3 text-justify rl-4">{item?.desc}</p>
      </div>
    ))
   }
     
  </div>
  )
}

export default Comments