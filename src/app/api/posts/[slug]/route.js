import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/utils/auth";
//prisma
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

//Get Single Post

export const GET = async (req, { params }) => {
  const { slug } = params;
  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "something went wrong!" }, { status: 500 })
    );
  }
};

// Update POST
export const PUT = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }, { status: 401 })
    );
  }

  try {
    const { ...updateData } = await req.json();
    const id = req.url.split("posts/")[1];
    // Check if the user has permission to update the post (you might want to add additional checks)
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { userEmail: true },
    });

    if (!existingPost || existingPost.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: "Permission denied" }, { status: 403 })
      );
    }
    // Perform the update
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { ...updateData, createdAt: new Date() },
    });

    return new NextResponse(JSON.stringify(updatedPost, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// Update Post Status
export const PATCH = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }, { status: 401 })
    );
  }

  try {
    const { status, features } = await req.json();
    const id = req.url.split("posts/")[1];

    // Check if the user has permission to update the post (you might want to add additional checks)
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { userEmail: true },
    });

    const adminEmails = [
      "tarequl.islam0025@gmail.com",
      "tareque179@gmail.com",
      "tareque.dev@gmail.com",
    ];

    const isAdmin = adminEmails.includes(session?.user?.email);

    // const role = isAdmin ? "admin" : "user";

    if (!existingPost && !isAdmin) {
      return new NextResponse(
        JSON.stringify({ message: "Permission denied" }, { status: 403 })
      );
    }
    // Perform the status update
    if (status) {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: { status },
      });
    } else if (features) {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: { features },
      });
    }
    return new NextResponse(JSON.stringify(updatedPost, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// DELETE Post
export const DELETE = async (req) => {
  // Get the user session
  const session = await getAuthSession();
  const { user } = await req.json();
  const id = req.url.split("posts/")[1];

  // Check if the user is authenticated
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }, { status: 401 })
    );
  }

  try {
    // Extract post ID from the request URL
    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { userEmail: true },
    });
    const adminEmails = [
      "tarequl.islam0025@gmail.com",
      "tareque179@gmail.com",
      "tareque.dev@gmail.com",
    ];

    const isAdmin = adminEmails.includes(session?.user?.email);

    // const role = isAdmin ? "admin" : "user";
    
    if (!existingPost || !isAdmin || user && (existingPost.userEmail !== session.user.email)) {
      return new NextResponse(
        JSON.stringify({ message: "Permission denied" }, { status: 403 })
      );
    }

    // Perform the deletion if the post exists
    if (existingPost) {
      const deletedPost = await prisma.post.delete({
        where: { id },
      });

      return new NextResponse(JSON.stringify(deletedPost, { status: 200 }));
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Post not found" }, { status: 404 })
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
