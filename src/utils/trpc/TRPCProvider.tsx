import {
  createReactQueryHooks,
  CreateTRPCClientOptions,
  TRPCClient,
  TRPCClientError,
} from '@trpc/react';
import type { AnyRouter, ResponseMeta } from '@trpc/server';
import { AppPropsType, NextPageContext } from 'next/dist/shared/lib/utils';
import React, { ReactNode, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

type QueryClientConfig = ConstructorParameters<typeof QueryClient>[0];

export type TRPCProviderConfig<TRouter extends AnyRouter> =
  CreateTRPCClientOptions<TRouter> & {
    queryClientConfig?: QueryClientConfig;
  };

export function TRPCProvider<TRouter extends AnyRouter>(
  props: AppPropsType & {
    trpc?: {
      config: TRPCProviderConfig<TRouter>;
      queryClient: QueryClient;
      trpcClient: TRPCClient<TRouter>;
      ssrState: 'prepass';
      ssrContext: NextPageContext;
    };
  } & {
    config: (info: { ctx?: NextPageContext }) => TRPCProviderConfig<TRouter>;
    children: ReactNode;
  } & (
      | {
          ssr?: false;
        }
      | {
          ssr: true;
          responseMeta?: (opts: {
            ctx: NextPageContext;
            clientErrors: TRPCClientError<TRouter>[];
          }) => ResponseMeta;
        }
    )
) {
  const trpc = createReactQueryHooks<TRouter, NextPageContext>();

  const { config: getClientConfig } = props;

  const [{ queryClient, trpcClient, ssrState, ssrContext }] = useState(() => {
    if (props.trpc) {
      return props.trpc;
    }
    const config = getClientConfig({});
    const queryClient = new QueryClient(config.queryClientConfig);
    const trpcClient = trpc.createClient(config);

    return {
      queryClient,
      trpcClient,
      ssrState:
        props.ssr && typeof window === 'undefined'
          ? ('mounting' as const)
          : (false as const),
      ssrContext: null,
    };
  });

  const hydratedState = trpc.useDehydratedState(
    trpcClient,
    (props as any).trpcState || props.pageProps?.trpcState
  );

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
      ssrState={ssrState}
      ssrContext={ssrContext}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={hydratedState}>{props.children}</Hydrate>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
