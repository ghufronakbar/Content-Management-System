import Footer from "~/components/material/Footer";
import Navbar from "~/components/material/Navbar";
import ArticlePage from "~/components/page/ArticlePage";

const Article = () => {
  return (
    <div className="w-full pt-24 min-h-screen">
      <Navbar />
      <div className="w-full min-h-screen">
        <ArticlePage />
      </div>
      <Footer />
    </div>
  );
};

export default Article;
