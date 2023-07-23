import { CustomFetcherResponse } from "@/types/swrTypes";

export const fetcher = async <T>(
  url: string
): Promise<CustomFetcherResponse<T>> => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return {
    status: response.status,
    data,
  };
};
