import PostCard from "./PostCard";

// Define the type for a post (using the same structure as in page.tsx)
interface Post {
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
}

// Define the props for the RecentPosts component
interface RecentPostsProps {
  limit: number;
  posts: Post[] | null;
}

export default function RecentPosts({
  limit,
  posts,
}: RecentPostsProps): React.ReactElement {
  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5">Últimas publicaciones</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {/* Render PostCards for each post; preserving keys and comments */}
        {posts &&
          posts.map((post: Post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
