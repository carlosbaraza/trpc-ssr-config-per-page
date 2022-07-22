import type { NextComponentType } from "next";
import type { AppRouter } from "../../pages/api/trpc/[trpc]";
import { config } from "./config";
import { _withTRPC as _withTRPC } from "./_withTRPC";

export function withTRPC({ ssr = true } = {}, Page: NextComponentType<any, any, any>) {
  return _withTRPC<AppRouter>({
    config,
    ssr,
  })(Page);
}
