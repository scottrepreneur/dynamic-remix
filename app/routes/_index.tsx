import type { MetaFunction } from "@remix-run/node";
import { useAccount } from "wagmi";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();

  return (
    <div>
      <p>wagmi connected: {isConnected ? "true" : "false"}</p>
      <p>wagmi address: {address}</p>
      <p>wagmi network: {chain?.id}</p>
    </div>
  );
}

export default function Index() {
  return (
    <>
      <AccountInfo />
    </>
  );
}
