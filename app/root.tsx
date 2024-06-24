import {
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import "./tailwind.css";
import Layout from "components/Layout";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "RainbowKit Remix Example",
    viewport: "width=device-width,initial-scale=1",
  },
];

type Env = {
  PUBLIC_ENABLE_TESTNETS?: string;
  PUBLIC_ALCHEMY_ID?: string;
  PUBLIC_DYNAMIC_ID?: string;
};

type LoaderData = { ENV: Env };

// Note: These environment variables are hard coded for demonstration purposes.
// See: https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables
export const loader: LoaderFunction = () => {
  console.log("loader");
  const data: LoaderData = {
    ENV: {
      PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS || "false",
      PUBLIC_ALCHEMY_ID: process.env.PUBLIC_ALCHEMY_ID || "",
      PUBLIC_DYNAMIC_ID: process.env.PUBLIC_DYNAMIC_ID || "",
    },
  };

  return json(data);
};

const queryClient = new QueryClient();

export default function App() {
  const { ENV } = useLoaderData<LoaderData>();
  const DYNAMIC_ID = ENV.PUBLIC_DYNAMIC_ID || "ENV_ID";

  // Remix modules cannot have side effects so the initialization of `wagmi`
  // client happens during render, but the result is cached via `useState`
  // and a lazy initialization function.
  // See: https://remix.run/docs/en/v1/guides/constraints#no-module-side-effects
  const [config] = useState(() => {
    const ALCHEMY_ID = ENV.PUBLIC_ALCHEMY_ID;
    const testChains = ENV.PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : [];

    return createConfig({
      chains: [mainnet, ...testChains], // polygon, optimism, arbitrum, base,
      multiInjectedProviderDiscovery: false,
      transports: {
        [mainnet.id]: http(
          `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        ),
        [polygon.id]: http(
          `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        ),
        [optimism.id]: http(
          `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        ),
        [arbitrum.id]: http(
          `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        ),
        [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`),
        [sepolia.id]: http(
          `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID}`,
        ),
      },
    });
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full h-full">
        {config ? (
          <DynamicContextProvider
            settings={{
              environmentId: DYNAMIC_ID,
              walletConnectors: [
                EthereumWalletConnectors,
                ZeroDevSmartWalletConnectors,
              ],
            }}
          >
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  <Layout>
                    <Outlet />
                  </Layout>
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </DynamicContextProvider>
        ) : null}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
