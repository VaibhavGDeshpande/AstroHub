import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  // If blog doesn't exist or isn't published (unless we want to implement preview mode here)
  if (!blog || !blog.published) {
    notFound();
  }

  const getReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <article className="min-h-screen bg-slate-950 text-slate-200 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Header */}
      <div className={`relative w-full overflow-hidden mb-12 md:mb-16 ${blog.coverImage ? 'h-[50vh] min-h-[400px] max-h-[600px] bg-slate-900' : 'pt-32'}`}>
        {blog.coverImage && (
          <>
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </>
        )}
        
        <div className={`${blog.coverImage ? 'absolute inset-0 flex flex-col justify-end' : ''} px-4 pb-8 md:pb-12 max-w-4xl mx-auto w-full z-10 relative`}>
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to transmissions
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              {getReadingTime(blog.content)} min read
            </span>
          </div>
        </div>
      </div>

      {/* HTML Content */}
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div 
          className="prose prose-invert prose-lg prose-headings:text-slate-100 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 w-full max-w-none prose-img:rounded-xl prose-img:shadow-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        <div className="mt-16 pt-8 border-t border-slate-800">
          <Link 
            href="/blogs" 
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Read more articles
          </Link>
        </div>
      </div>
    </article>
  );
}
