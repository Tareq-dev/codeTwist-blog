import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { getAuthSession } from "@/utils/auth";
//prisma

// let prisma;
// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// const prisma = new PrismaClient();

global.prisma = global.prisma || new PrismaClient({ log: ["info"] });

if (process.env.NODE_ENV !== "production") {
  global.prisma = global.prisma || new PrismaClient({ log: ["info"] });
}



// Get Data
export const GET = async () => {
  try {
    const posts = await prisma.post.findMany();
    return new NextResponse(JSON.stringify(posts, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }, { status: 500 })
    );
  }
};

// Create POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();

    const posts = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });
    return new NextResponse(JSON.stringify(posts, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }, { status: 500 })
    );
  }
};

// Add this block to your existing API code to include an update post API
