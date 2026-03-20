import { useState } from 'react'
import { useParams } from "react-router-dom";
import Snippet from "./Snippet";
import {useQuery} from "@tanstack/react-query";
import { getPostQueryOptions } from "../queryOptions/postQueryOptions";
import Spinner from "./Spinner";
import BackButton from './BackButton';
import CommentSection from './CommentSection';

function Post() {
  const { postId } = useParams();
  const postIdInt = Number(postId);
  const { data, isLoading, isError, error, refetch } = useQuery(getPostQueryOptions(postIdInt));

  if (isLoading) return <Spinner />;

  if (isError) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className='h-screen w-full flex flex-col items-center justify-start gap-4 px-32 pt-4 overflow-auto'>
        <div className="w-7/10 min-w-75 flex flex-col gap-10">
            <Snippet item={data} queryKey={['post', postIdInt]} />
              {/* Comment section */}
              <CommentSection comments={data.comments} count={data._count.comments} />

        </div>
        <BackButton />
    </div>
  )
}

export default Post