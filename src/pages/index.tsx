import { Box, Button } from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import { useInfiniteQuery } from "react-query";

import { CardList } from "../components/CardList";
import { Error } from "../components/Error";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";

interface Image {
  id: string;
  title: string;
  description: string;
  url: string;
  ts: number;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<{ data: Image[]; after: string | null }>(
    "images",
    async ({ pageParam = 0 }: { pageParam?: number } = {}) => {
      const response = await api.get("/images", {
        params: {
          after: pageParam,
        },
      });

      return response.data;
    },
    {
      getNextPageParam: lastPage => lastPage?.after || null,
    },
  );

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(page => page.data);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <Fragment>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            mt={10}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </Button>
        )}
      </Box>
    </Fragment>
  );
}