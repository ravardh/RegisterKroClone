import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdArticle } from "react-icons/md";
import SEOHelmet from "../components/SEOHelmet";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(savedPosts);
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
          <Link
            to="/create-blog"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-(--primary) hover:bg-gray-100"
          >
            <MdAdd className="h-5 w-5" /> Create Blog
          </Link>
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
              <article
                key={post.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-(--primary)">
                  {post.category || "Blog"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {post.author} | {post.createdAt}
                </p>
                <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-700">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Blog;
