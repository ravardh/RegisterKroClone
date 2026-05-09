import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import SEOHelmet from "../components/SEOHelmet";
import axios from "../config/api";
import "quill/dist/quill.snow.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/public/blogs/${slug}`);
        setBlog(res.data.data || null);
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading blog...
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Blog not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            The blog you are trying to open does not exist or is not published.
          </p>
          <Link
            to="/blog"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-hover)"
          >
            <MdArrowBack className="h-5 w-5" /> Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEOHelmet
        title={`${blog.title} - TaxProSolution Blog`}
        description={blog.summary || "Read this article from TaxProSolution blog."}
        keywords={`${blog.category || "blog"}, tax, compliance, registration`}
        canonicalUrl={`https://taxprosolution.co.in/blog/${blog.slug}`}
      />

      <section className="bg-[url('/hero.webp')] bg-cover bg-center -mt-20 pt-32 pb-14 px-4 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30"
          >
            <MdArrowBack className="h-5 w-5" /> Back to Blogs
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-yellow-300">
            {blog.category || "Blog"}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{blog.title}</h1>
          <p className="mt-3 text-sm text-white/90">
            {blog.author} |{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-10">
        <article className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          {blog.summary && (
            <p className="mb-6 rounded-lg bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-900">
              {blog.summary}
            </p>
          )}
          <div className="overflow-x-auto w-full">
            <div
              className="ql-editor !p-0 text-gray-700 min-w-full"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </section>
    </>
  );
};

export default BlogDetail;
