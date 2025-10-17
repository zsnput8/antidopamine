import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageCircle, Send } from 'lucide-react';
import { supabase, type Post, type Comment } from '../lib/supabase';

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  isAdminMode: boolean;
}

export function PostDetail({ post, onClose, isAdminMode }: PostDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: 'Anonymous', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          author: newComment.author,
          content: newComment.content
        }]);

      if (error) {
        console.error('Error creating comment:', error);
        return;
      }

      setNewComment({ author: 'Anonymous', content: '' });
      loadComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAdminMode) {
      alert('Only admins can delete comments');
      return;
    }

    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId);

        if (error) {
          console.error('Error deleting comment:', error);
          return;
        }

        loadComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-start justify-between rounded-t-xl z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold text-gray-100 mb-3">
              {post.title}
            </h2>
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
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="prose max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {post.content}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-gray-100">
                Comments ({comments.length})
              </h3>
            </div>

            <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <input
                  type="text"
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100"
                  placeholder="Your name (or stay Anonymous)"
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  rows={3}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100 resize-none"
                  placeholder="Write a comment..."
                  required
                />
                <button
                  type="submit"
                  className="px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">Loading comments...</div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-200">{comment.author}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{formatDate(comment.created_at)}</span>
                      </div>
                      {isAdminMode && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-400 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
