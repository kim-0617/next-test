/* eslint-disable react-hooks/exhaustive-deps */
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import * as _ from 'lodash';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const BasicReactQuery = () => {
  const queryClient = useQueryClient();

  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam);
    return res.json();
  };

  const throttledFetchNextPage = _.throttle(() => {
    console.log("Throttled fetch attempt!");
    if (!isFetching && hasNextPage) {
      fetchNextPage()
    }
  }, 1000,)

  const NonThrottledFetchNextPage = () => {
    console.log("Non-throttled fetch attempt!");
    if (!isFetching && hasNextPage) {
      fetchNextPage()
    }
  }

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

  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      throttledFetchNextPage()
    }
  }, [inView])

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <div key={i} style={{ padding: 20, border: '1px solid #fff', margin: 20 }}>
          {group.data.map((project: { id: string; name: string }, index: number) => {
            return (
              <div key={project.id}>
                {project.name}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={ref} style={{ height: 200, background: 'yellow' }} />
    </>
  );
};

export default BasicReactQuery;