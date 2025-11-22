import React, { useState, useEffect } from 'react';
import { PlusCircle, CreditCard as Edit3, Trash2, Calendar, User, Search, AlertTriangle } from 'lucide-react';
import { supabase, type Post } from './lib/supabase';
import { PostDetail } from './components/PostDetail';
import { checkRateLimit, recordLoginAttempt } from './utils/rateLimit';
import { validatePostTitle, validatePostContent, validateAuthorName, detectXSSAttempt, detectSQLInjection, encodeForHTML, validatePostInput } from './utils/security';
import { generateFingerprint } from './utils/fingerprint';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: 'Anonymous', is_verified: false, post_type: 'public' as 'admin_only' | 'public' });
  const [activeTab, setActiveTab] = useState<'admin' | 'public'>('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<string>('');
  const [clientFingerprint, setClientFingerprint] = useState<string>('');

  const ADMIN_PASSWORD = 'aNCxap@YVchw1C0V!TzH#UfQQ6z4hG';

  // Load posts from Supabase on component mount and generate fingerprint
  useEffect(() => {
    generateFingerprint().then(fp => setClientFingerprint(fp));
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    if (!validatePostTitle(newPost.title)) {
      alert('Invalid title. Must be between 1 and 200 characters.');
      return;
    }

    if (!validatePostContent(newPost.content)) {
      alert('Invalid content. Must be between 1 and 50000 characters.');
      return;
    }

    if (!validateAuthorName(newPost.author)) {
      alert('Invalid author name. Must be between 1 and 100 characters.');
      return;
    }

    if (detectXSSAttempt(newPost.title) || detectXSSAttempt(newPost.content) || detectXSSAttempt(newPost.author)) {
      alert('Invalid input detected. Please remove any HTML or scripts.');
      return;
    }

    if (detectSQLInjection(newPost.title) || detectSQLInjection(newPost.content) || detectSQLInjection(newPost.author)) {
      alert('Invalid input detected. Please use safe characters only.');
      return;
    }

    if (newPost.post_type === 'admin_only' && !isAdminMode) {
      alert('Only admins can create admin announcements.');
      return;
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: encodeForHTML(newPost.title),
            content: encodeForHTML(newPost.content),
            author: encodeForHTML(newPost.author),
            is_verified: newPost.is_verified,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);

        if (error) {
          console.error('Error updating post:', error);
          return;
        }

        setEditingPost(null);
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([{
            title: encodeForHTML(newPost.title),
            content: encodeForHTML(newPost.content),
            author: encodeForHTML(newPost.author),
            is_verified: newPost.is_verified,
            post_type: newPost.post_type,
            fingerprint: clientFingerprint
          }]);

        if (error) {
          console.error('Error creating post:', error);
          return;
        }
      }

      setNewPost({ title: '', content: '', author: 'Anonymous', is_verified: false, post_type: 'public' });
      setIsWriting(false);
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post: Post) => {
    if (!isAdminMode) {
      alert('Only admins can edit posts');
      return;
    }
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      author: post.author,
      is_verified: post.is_verified || false,
      post_type: post.post_type
    });
    setIsWriting(true);
  };

  const handleDelete = async (id: string) => {
    alert('Post deletion is disabled for security reasons. Contact an administrator if you need to remove a post.');
  };

  const cancelEdit = () => {
    setIsWriting(false);
    setEditingPost(null);
    setNewPost({ title: '', content: '', author: 'Anonymous', is_verified: false, post_type: 'public' });
  };

  const handleAdminLogin = async () => {
    setLoginError('');
    setRateLimitInfo('');

    const rateLimitCheck = await checkRateLimit();

    if (!rateLimitCheck.allowed) {
      setLoginError(rateLimitCheck.reason || 'Too many attempts. Please try again later.');
      return;
    }

    if (rateLimitCheck.waitTime && rateLimitCheck.waitTime > 0) {
      setIsLoggingIn(true);
      setRateLimitInfo(`Please wait ${rateLimitCheck.waitTime / 1000} seconds...`);

      await new Promise(resolve => setTimeout(resolve, rateLimitCheck.waitTime));

      setIsLoggingIn(false);
      setRateLimitInfo('');
    }

    if (adminPassword === ADMIN_PASSWORD) {
      await recordLoginAttempt(true);
      setIsAdminMode(true);
      setAdminPassword('');
      setLoginError('');
    } else {
      await recordLoginAttempt(false);
      const remaining = (rateLimitCheck.remainingAttempts || 1) - 1;
      setLoginError(`Wrong password. ${remaining} attempts remaining before lockout.`);
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setNewPost({ ...newPost, is_verified: false, post_type: 'public' });
    setLoginError('');
    setRateLimitInfo('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const adminPosts = posts.filter(post => post.post_type === 'admin_only');
  const publicPosts = posts.filter(post => post.post_type === 'public');

  const filteredAdminPosts = adminPosts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  const filteredPublicPosts = publicPosts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 font-['Inter'] text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-400 flex items-center gap-3">
                The Stream of Consciousness Dump
                {isAdminMode && (
                  <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full">ADMIN</span>
                )}
              </h1>
              <p className="text-gray-400 mt-2">
                anonymous thoughts, raw perspectives, unfiltered worldviews
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-100 w-64"
                />
              </div>
              {!isAdminMode ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Admin password"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-100"
                      onKeyPress={(e) => e.key === 'Enter' && !isLoggingIn && handleAdminLogin()}
                      disabled={isLoggingIn}
                    />
                    <button
                      onClick={handleAdminLogin}
                      disabled={isLoggingIn}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingIn ? 'Wait...' : 'Login'}
                    </button>
                  </div>
                  {(loginError || rateLimitInfo) && (
                    <div className={`flex items-center gap-1 text-xs ${loginError ? 'text-red-400' : 'text-yellow-400'}`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{loginError || rateLimitInfo}</span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
              <button
                onClick={() => setIsWriting(!isWriting)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                {isWriting ? 'Cancel' : 'New Post'}
              </button>
            </div>
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
              {isAdminMode && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={newPost.is_verified}
                      onChange={(e) => setNewPost({ ...newPost, is_verified: e.target.checked })}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="verified" className="text-sm font-medium text-gray-300">
                      Post as verified admin
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Post Type
                    </label>
                    <select
                      value={newPost.post_type}
                      onChange={(e) => setNewPost({ ...newPost, post_type: e.target.value as 'admin_only' | 'public' })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100"
                    >
                      <option value="public">Public Post (anyone can post)</option>
                      <option value="admin_only">Admin Announcement (admin only)</option>
                    </select>
                  </div>
                </>
              )}
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
          {loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
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
            filteredPublicPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="flex items-center gap-2">
                          {post.author}
                          {post.is_verified && (
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              ✓ VERIFIED
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>
                  {isAdminMode && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-gray-700 bg-gray-800 mt-16">
        <p className="text-gray-400">
          a place to stimulate your introspective thoughts
        </p>
      </footer>

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          isAdminMode={isAdminMode}
        />
      )}
    </div>
  );
}

export default App;