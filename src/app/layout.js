// import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";
// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "CodeTwist",
  description: "Tareq's Blog",
};

export default function RootLayout({ children }) {
   

  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          
            <div className="bg-green-50">
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </div>
          
        </AuthProvider>
      </body>
    </html>
  );
}
