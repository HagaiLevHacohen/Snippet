import { useState } from 'react'
import avatar from "../assets/avatars/avatar.png";
import { format } from 'timeago.js';
import CommentForm from "./CommentForm";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/like";

function Snippet({ item, queryKey, clickable, onClick }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({ // optimistic update
    mutationFn: toggleLike,

    onMutate: async (postId) => { // runs before the API call
      await queryClient.cancelQueries({ queryKey }); // cancel any outgoing refetches (so they don't overwrite our optimistic update)

      const previousData = queryClient.getQueryData(queryKey); // snapshot the previous value

      queryClient.setQueryData(queryKey, (oldData) => { // optimistically update to the new value
        if (!oldData) return oldData;

        // If it’s a single post
        if (!oldData.pages) {
          return {
            ...oldData,
            isLiked: !oldData.isLiked,
            _count: {
              ...oldData._count,
              likes: oldData.isLiked
                ? oldData._count.likes - 1
                : oldData._count.likes + 1
            }
          };
        }

        // If it’s an infinite query with pages
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => {
              if (post.id !== postId) return post;

              const isLiked = !post.isLiked;

              return {
                ...post,
                isLiked,
                _count: {
                  ...post._count,
                  likes: isLiked
                    ? post._count.likes + 1
                    : post._count.likes - 1,
                },
              };
            }),
          })),
        };
      });

      return { previousData }; // return the snapshotted value so we can use it in case of an error
    },

    onError: (err, postId, context) => { // if the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context.previousData);
    },

    onSettled: () => { // always refetch after error or success:
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleLike = (e) => {
    e.stopPropagation(); // prevent triggering onClick for the whole snippet
    mutation.mutate(item.id);
  };
  
  return (
    <div onClick={clickable ? onClick : undefined} className={`${clickable ? 'cursor-pointer hover:shadow-pink-400 hover:shadow-lg transition' : ''} p-4 bg-gray-800 border border-gray-700 shadow-md text-gray-100 space-y-6`}>
      
      {/* Profile picture */}
      <div className="flex items-center space-x-3">
        <img 
          src={item.user.avatarUrl ? item.user.avatarUrl : avatar} 
          alt="Profile" 
          className="w-15 h-15 rounded-full object-cover border border-gray-600"
        />
        <span className="text-white">{item.user.name}</span>
        <span className="text-gray-400 text-sm">@ {item.user.username}</span>
        <span className="text-gray-400 text-sm ml-auto">{format(item.createdAt)}</span>
      </div>

      {/* Snippet text */}
      <p className="text-lg pl-4 whitespace-pre-wrap wrap-break-word break-all">
        {item.content}
      </p>

      {/* Comment section */}
        <CommentForm postId={item.id} />


      {/* Footer with likes and comments */}
      <div className="flex items-center gap-10 mt-2">
        
        {/* Likes */}
        <div onClick={handleLike} className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 fill-current ${item.isLiked ? 'text-pink-500' : 'text-gray-400'}`} viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {item._count.likes}
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h6M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
          </svg>
          {item._count.comments}
        </div>

      </div>
    </div>
  )
}

export default Snippet