import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

export const BASE_API_DEV =
  "https://api.thegraph.com/subgraphs/name/astrteam/astr";
export const BASE_API_PROD =
  "https://api.thegraph.com/subgraphs/name/astrteam/luckystar";

export const isDev = process.env.NEXT_PUBLIC_BRANCH === "dev";

export const BASE_API = isDev ? BASE_API_DEV : BASE_API_PROD;

export const useUserBind = (id: string) => {
  return useQuery(
    ["userBind", id],
    async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const data: any = await request(
        BASE_API,
        gql`
          query {
            data:userBind(id: "${id}") {
              id
              root
              BindNum
              blockTimestamp
              blockNumber
            }
          }
        `
      );

      return data?.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useMyNFTList = (id: string) => {
  return useQuery(
    ["myNftList", id],
    async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const data: any = await request(
        BASE_API,
        gql`
          query {
            data:astrNFTs(where:{user:"${id}",isDelete:"0"}) {
              age
              id
              tokenId
              imageUrl
              isDelete
              price
              splitPrice
              coldTime
              sellPrice
              sellTime
              user
            }
          }
        `
      );

      return data?.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useMarketNFTList = (
  orderBy: string,
  orderDirection: string,
  skip: number,
  random: number
) => {
  return useQuery(
    ["astrNFTs", orderBy, orderDirection, skip, random],
    async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const data: any = await request(
        BASE_API,
        gql`
          query {
            data:astrNFTs(orderBy:"${orderBy}",orderDirection:"${orderDirection}",skip: ${skip}, first: 8,where:{sellPrice_gt: "0"}){
              age
              id
              imageUrl
              isDelete
              price
              splitPrice
              sellPrice
              sellTime
              user
              tokenId
            }
          }
        `
      );

      return data?.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};
