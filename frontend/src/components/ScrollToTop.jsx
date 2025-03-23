import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when the route changes
  }, [pathname]);

  return null; // This component doesn’t render anything
};

export default ScrollToTop;
