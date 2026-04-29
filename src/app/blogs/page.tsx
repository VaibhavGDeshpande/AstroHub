import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogsDb";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const revalidate = 0; // Prevent aggressive caching so new posts show up

export default async function BlogsPage() {
  const supabase = await createClient();
  const { data: blogsData } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('createdAt', { ascending: false });

  const blogs = blogsData || [];

  // Helper to estimate reading time (approx 200 words per minute)
  const getReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-24 md:pt-40 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-6">
            AstroHub Transmission
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dive into our collection of articles exploring the cosmos, astronomical phenomena, and the technology that helps us see the stars.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm">
            <p>No transmissions received yet. Check back later for new articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: Blog) => (
              <Link 
                href={`/blogs/${blog.slug}`} 
                key={blog.id}
                className="group flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {getReadingTime(blog.content)} min read
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 mt-auto">
                    Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
