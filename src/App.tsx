import React, { useState, useEffect } from 'react';
import { PlusCircle, CreditCard as Edit3, Trash2, Calendar, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: 'Anonymous' });

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    if (editingPost) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...editingPost, ...newPost, date: new Date().toLocaleDateString('en-US') }
          : post
      ));
      setEditingPost(null);
    } else {
      // Create new post
      const post: Post = {
        id: Date.now().toString(),
        ...newPost,
        date: new Date().toLocaleDateString('en-US')
      };
      setPosts([post, ...posts]);
    }

    setNewPost({ title: '', content: '', author: 'Anonymous' });
    setIsWriting(false);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, author: post.author });
    setIsWriting(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const cancelEdit = () => {
    setIsWriting(false);
    setEditingPost(null);
    setNewPost({ title: '', content: '', author: 'Anonymous' });
  };

  return (
    <div className="min-h-screen bg-gray-900 font-['Inter'] text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-400">
                The Stream of Consciousness Dump
              </h1>
              <p className="text-gray-400 mt-2">
                anonymous thoughts, raw perspectives, unfiltered worldviews
              </p>
            </div>
            <button
              onClick={() => setIsWriting(!isWriting)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              {isWriting ? 'Cancel' : 'New Post'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Write/Edit Form */}
        {isWriting && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              {editingPost ? 'Edit Post' : 'Write New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100"
                  placeholder="Your name or stay Anonymous"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100"
                  placeholder="What's on your mind?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-100"
                  placeholder="Share your thoughts, perspectives, experiences... anything goes"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {editingPost ? 'Update Post' : 'Post It'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">
                <Edit3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Click "New Post" to start sharing your thoughts
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-100 mb-3">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit post"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-gray-700 bg-gray-800 mt-16">
        <p className="text-gray-400">
          speak freely, think deeply
        </p>
      </footer>
    </div>
  );
}

export default App;