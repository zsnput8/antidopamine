import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { type Post } from '../lib/supabase';

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  isAdminMode: boolean;
}

export function PostDetail({ post, onClose }: PostDetailProps) {
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

        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {post.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
