import Category from "@/components/Category";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import PaginatedBlog from "@/components/PaginatedBlog";
import Subscribe from "@/components/Subscribe";

export default function Home() {
  return (
    <div>
      <Header />
      <Category />
      <Subscribe />
      <PaginatedBlog />
      <Contact />
    </div>
  );
}
