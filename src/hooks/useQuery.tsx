import { useLocation } from "react-router-dom";

export const useQuery = (queryName: string) => {
  return new URLSearchParams(useLocation().search).get(queryName);
};
