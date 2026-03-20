import { useState } from 'react'
import Comment from './Comment';

function CommentSection({comments, count}) {

  return (
    <div className='flex flex-col bg-gray-800 border border-gray-700 rounded-t-md'>
        {count ? comments.map((comment) => (
            <Comment key={comment.id} item={comment}/>
        )) : <p className="text-gray-500 h-10 p-2 italic">No comments yet.</p>}
    </div>
  )
}

export default CommentSection