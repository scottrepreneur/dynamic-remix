import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import useHydrated from "hooks/useHydrated";

function Navbar() {
  const hydrated = useHydrated();

  return (
    <div className="flex flex-row justify-between w-full">
      <p>Test</p>
      <div>{hydrated ? <DynamicWidget /> : null}</div>
    </div>
  );
}

export default Navbar;
