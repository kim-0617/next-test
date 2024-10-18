import { useInfiniteQuery } from '@tanstack/react-query';
import { throttle } from 'lodash';
import React, { useEffect, useRef } from 'react';

const BasicReactQueryWithScroll = () => {
  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam);
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    console.log("scroll")
    if (observerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = observerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  const handleScrollWithThrottle = throttle(() => {
    console.log("scroll")
    if (observerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = observerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage) {
        fetchNextPage();
      }
    }
  }, 300)

  useEffect(() => {
    const observerElement = observerRef.current;
    if (observerElement) {
      observerElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (observerElement) {
        observerElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasNextPage]);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div
      ref={observerRef}
      style={{ width: '100%', height: '100vh', overflowY: 'auto', textAlign: 'center' }}
    >
      {data.pages.map((group, i) => (
        <div key={i} style={{ padding: 20, border: '1px solid #fff', margin: 20 }}>
          {group.data.map((project: { id: string; name: string }) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </div>
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default BasicReactQueryWithScroll;