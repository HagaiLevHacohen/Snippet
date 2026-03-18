import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../api/post';
import { getComments } from '../api/comment';
import { getLikes } from '../api/like'; 
import Spinner from './Spinner';
import Snippet from './Snippet';

export default function FeedList({ activeTab, user }) {
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

  if (isLoading) return <Spinner />;

  return (
    <div className='flex flex-col'>
      {data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} />)
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}