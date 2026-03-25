import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../api/post';
import { getUsers } from '../api/user';
import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getComments } from '../api/comment';
import { getLikes } from '../api/like'; 
import Spinner from './Spinner';
import Snippet from './Snippet';
import Comment from './Comment';
import User from './User';

export default function FeedList({ activeTab, user, search }) {
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // current route info

  const openPost = (postId) => {
    navigate(`/posts/${postId}`, {
      state: { from: location.pathname + location.search }
    });
  };

  const getQueryKey = () => {
    switch (activeTab) {
      case "posts":
        return ["posts", { userId: user.id }];

      case "comments":
        return ["comments", { userId: user.id }];

      case "likes":
        return ["likes", { userId: user.id }];

      case "followingPosts":
        return ["posts", { section: "followingPosts" }];

      case "recent":
        return ["posts", { section: "recent" }];

      case "searchPosts":
        return ["posts", { search }];

      case "searchUsers":
        return ["users", { search }];

      default:
        return ["feed"];
    }
  };

  const queryKey = getQueryKey();

  const fetcher = ({ pageParam = 1 }) => {
    if (activeTab === 'posts') return getPosts({ userId: user.id, page: pageParam });
    if (activeTab === 'comments') return getComments({ userId: user.id, page: pageParam });
    if (activeTab === 'likes') return getLikes({ userId: user.id, page: pageParam });
    if (activeTab === 'followingPosts') return getPosts({ section: 'following', page: pageParam });
    if (activeTab === 'recent') return getPosts({ page: pageParam });
    if (activeTab === 'searchPosts') return getPosts({ page: pageParam, search });
    if (activeTab === 'searchUsers') return getUsers({ page: pageParam, search });

  };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: queryKey,
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
      { activeTab === 'posts' && 
      data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={queryKey} clickable onClick={() => openPost(item.id)} />)
      )
      }
      { activeTab === 'comments' && 
      data.pages.map(page =>
        page.items.map(item => <Comment key={item.id} item={item} />)
      )
      }
      { activeTab === 'likes' && 
      data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={queryKey} clickable onClick={() => openPost(item.id)} />)
      )
      }
      { activeTab === 'followingPosts' && 
      data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={queryKey} clickable onClick={() => openPost(item.id)} />)
      )
      }
      { activeTab === 'recent' && 
      data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={queryKey} clickable onClick={() => openPost(item.id)} />)
      )
      }
      { activeTab === 'searchPosts' && 
      data.pages.map(page =>
        page.items.map(item => <Snippet key={item.id} item={item} queryKey={queryKey} clickable onClick={() => openPost(item.id)} />)
      )
      }
      { activeTab === 'searchUsers' && 
      data.pages.map(page =>
        page.items.map(item => <User key={item.id} item={item} queryKey={queryKey} />)
      )
      }
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