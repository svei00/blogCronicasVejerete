export const revalidate = 60; // or 300, 3600, 86400 depending on your desired interval

import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "./components/RecentPosts";

// Define the expected type for a post
interface Post {
  _id: string; // using _id as unique identifier (adjust if necessary)
  slug: string;
  image: string;
  title: string;
  category: string;
  content?: string;
  createdAt?: string;
}

export default async function Home(): Promise<React.ReactElement> {
  // Explicitly define posts as an array of Post objects or null
  let posts: Post[] | null = null;

  try {
    // Fetch posts from the API
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensuring correct headers
      },
      body: JSON.stringify({ limit: 9, order: "desc" }),
      cache: "no-store",
    });

    // Check if the request was successful
    if (!result.ok) {
      throw new Error(`Failed to fetch posts: ${result.statusText}`);
    }

    // Parse the response data
    const data = await result.json();
    posts = data.posts; // Store the fetched posts
  } catch (error) {
    console.error("Error getting posts:", error);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl text-purple-500 font-bold lg:text-6xl">
          Bienvenidos al Blog de Cro{"\u0301"}nicas del Vejerete{" "}
          {/* Alternative: &oacute; */}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Blog sobre diferentes temas desde un punto de vista personal
        </p>
        {/* Link to all posts */}
        <Link
          href="/search"
          className="text-xs sm:text-sm text-orange-500 font-bold hover:text-purple-600"
        >
          Ver todas las publicaciones
        </Link>
      </div>

      {/* Call To Action Section */}
      <div className="p-3 bg-slate-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      {/* Recent Posts Section */}
      <div className="p-3 flex flex-col gap-8 py-7">
        {/* Pass the fetched posts to RecentPosts to avoid duplicate API calls */}
        <RecentPosts limit={9} posts={posts} />
        {/* Link to all posts in a specific category */}
        <Link
          href="/search?category=null"
          className="text-lg text-orange-500 font-bold hover:text-purple-600 text-center"
        >
          Ver todas las publicaciones
        </Link>
      </div>
    </div>
  );
}
