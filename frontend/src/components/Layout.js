import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const Layout = () => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <div ref={headerRef}>
        <Header />
      </div>

      <div
        className="content"
        style={{
          marginTop: `${headerHeight + 100}px`, // Dynamic margin to prevent overlap
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
