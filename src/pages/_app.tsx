import { AppType } from "next/dist/shared/lib/utils";
import { config } from "../utils/trpc/config";
import { TRPCProvider } from "../utils/trpc/TRPCProvider";

const MyApp: AppType = (props) => {
  const { Component, pageProps } = props;

  return (
    <TRPCProvider config={config} {...props}>
      <Component {...pageProps} />;
    </TRPCProvider>
  );
};

export default MyApp;
