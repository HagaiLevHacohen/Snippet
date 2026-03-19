import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../api/post';
import { useRef, useEffect } from 'react';
import { getComments } from '../api/comment';
import { getLikes } from '../api/like'; 
import Spinner from './Spinner';
import Snippet from './Snippet';

export default function FeedList({ activeTab, user }) {
  const observerRef = useRef(null);


  const fetcher = ({ pageParam = 1 }) => {
    if (activeTab === 'posts') return getPosts({ userId: user.id, page: pageParam });
    if (activeTab === 'comments') return getComments({ userId: user.id, page: pageParam });
    return getLikes({ userId: user.id, page: pageParam });
  };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: [activeTab, user.id],
    queryFn: fetcher,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    keepPreviousData: true,
  });

  // Intersection Observer
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) { // load more when the sentinel comes into view
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current); // start observing the sentinel
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  

  if (isLoading) return <Spinner />;

  return (
    <div className='flex flex-col'>
      {data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={[activeTab, user.id]} />)
      )}

      {/* Sentinel + Spinner */}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && (
          <p className="text-center text-gray-400 py-4">
            No more content
          </p>
        )}
      </div>
    </div>
  );
}