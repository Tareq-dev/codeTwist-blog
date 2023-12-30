import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import  { getAuthSession }  from "@/utils/auth";

//prisma

// const prisma = new PrismaClient();

global.prisma = global.prisma || new PrismaClient({ log: ["info"] });

if (process.env.NODE_ENV !== "production") {
  global.prisma = global.prisma || new PrismaClient({ log: ["info"] });
}
// let prisma;
// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

//GET ALL COMMENTS OF POST

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");

  try {
    const commnents = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
      include: { user: true },
    });
    return new NextResponse(JSON.stringify(commnents, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }, { status: 500 })
    );
  }
};

// Create Comment
export const POST = async (req) => {
     const session = await getAuthSession()

if(!session) {
  return new NextResponse(
    JSON.stringify({ message:"Not Authenticated" },{ status: 401})
  )
}
  try {
    const body = await req.json()
    const commnent = await prisma.comment.create({
     data:{...body, userEmail: session.user.email},
    });
    return new NextResponse(JSON.stringify(commnent, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }, { status: 500 })
    );
  }
};
