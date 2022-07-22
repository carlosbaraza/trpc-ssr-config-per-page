import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { AnyRouter } from "@trpc/server";
import { NextPageContext } from "next/dist/shared/lib/utils";
import { TRPCProviderConfig } from "./TRPCProvider";

type GetClientConfig = <TRouter extends AnyRouter>(info: {
  ctx?: NextPageContext;
}) => TRPCProviderConfig<TRouter>;

export const config: GetClientConfig = ({ ctx }) => {
  if (typeof window !== "undefined") {
    // during client requests
    return {
      links: [httpBatchLink({ url: "/api/trpc", maxBatchSize: 10 })],
    };
  }

  // during SSR below
  return {
    url: "http://localhost:3000/api/trpc",
  };
};
