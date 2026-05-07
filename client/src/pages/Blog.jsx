import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdArticle } from "react-icons/md";
import SEOHelmet from "../components/SEOHelmet";
import axios from "../config/api";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/public/blogs");
        setPosts(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <SEOHelmet
        title="Blog - TaxProSolution"
        description="Read the latest business, tax, registration, and compliance updates from TaxProSolution."
        keywords="blog, business updates, tax updates, company registration"
        canonicalUrl="https://taxprosolution.co.in/blog"
      />

      <section className="bg-[url('/hero.webp')] bg-cover bg-center -mt-20 pt-32 pb-14 px-4 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
              Business registration, tax, and compliance insights in one place.
            </p>
          </div>
   
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <MdArticle className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-3 text-xl font-semibold text-gray-800">
              No blogs created yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create your first blog post to show it here.
            </p>
            <Link
              to="/create-blog"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-hover)"
            >
              <MdAdd className="h-5 w-5" /> Create Blog
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="group block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-(--primary)">
                  {post.category || "Blog"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-(--primary)">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {post.author} |{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div
                  className="prose prose-sm mt-4 max-h-36 max-w-none overflow-hidden text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <p className="mt-4 text-sm font-semibold text-(--primary)">Read full blog &rarr;</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Blog;
