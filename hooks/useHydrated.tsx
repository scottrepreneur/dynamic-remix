import { useEffect, useState } from "react";

let isHydrating = true;

const useHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

export default useHydrated;
