import { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";

import { Link } from "react-router-dom";
// import { NavLink } from "react-router-dom";
const styleTooltip = {
  position: "absolute",
  background:
    "linear-gradient(40deg, rgba(6,6,2,0.7847514005602241) 26%, rgba(23,7,6,0.7819502801120448) 100%)",
  color: "#ffff",
  padding: "5px 10px",
  borderRadius: "5px",
  top: "10%",
  left: "-40%",
  transform: "translateX(-50%)",
  whiteSpace: "normal",
  zIndex: "1000",
  visibility: "hidden",
  fontweight: "500",
  wordBreak: "break-word",
  width: "12rem",
  fontSize: "0.8rem",
};

const MenuItems = ({ items, depthLevel }) => {
  // console.log(items);
  const handleClick = (e) => {
    // Prevent the default action only if the URL is the same as the current path
    if (window.location.pathname === items.url) {
      e.preventDefault();
      window.location.reload(); // Force reload
    }
  };

  const [dropdown, setDropdown] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mouseover", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mouseover", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    if (items.tooltip) {
      setTooltipVisible(true);
    }
    setDropdown(true);
  };

  const onMouseLeave = () => {
    setTooltipVisible(false);
    setDropdown(false);
  };

  const closeDropdown = () => {
    setDropdown(false);
  };

  const [left, setLeft] = useState(false);
  const [maintainLeft, setMaintainLeft] = useState(false);

  useEffect(() => {
    if (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    ) {
      if (depthLevel >= 1) {
        setLeft(true);
        setMaintainLeft(true);
      } else if (depthLevel <= 1) {
        setLeft(false);
      }
    } else if (
      document.documentElement.scrollWidth ===
        document.documentElement.clientWidth &&
      depthLevel < 1
    ) {
      setLeft(false);
    } else {
      setMaintainLeft(false);
    }
  }, [dropdown, depthLevel, window.innerWidth]);
  useEffect(() => {
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        setLeft(false);
      }
    };

    window.addEventListener("wheel", handleWheel);
  }, []);

  // return (
  //   <>
  //     <li
  //       className="menu-items"
  //       ref={ref}
  //       onMouseEnter={onMouseEnter}
  //       onMouseLeave={onMouseLeave}
  //       onClick={closeDropdown}
  //       style={{ position: "relative" }}
  //     >
  //       {tooltipVisible && items.tooltip && (
  //         <div
  //           style={{
  //             ...styleTooltip,
  //             visibility: tooltipVisible ? "visible" : "hidden",
  //             left: left ? "-40%" : "90%",
  //           }}
  //         >
  //           {items.tooltip}
  //         </div>
  //       )}
  //       {items.url && items.submenu ? (
  //         <>
  //           <button
  //             type="button"
  //             aria-haspopup="menu"
  //             aria-expanded={dropdown ? "true" : "false"}
  //             onClick={() => setDropdown((prev) => !prev)}
  //           >
  //             {window.innerWidth < 940 && depthLevel === 0 ? (
  //               items.title
  //             ) : (
  //               <a
  //                 href={items.url}
  //                 onClick={handleClick} // Use handleClick to force reload
  //                 className={
  //                   window.location.pathname === items.url ? "active" : ""
  //                 }
  //               >
  //                 {items.title}
  //               </a>
  //             )}
  //             {depthLevel > 0 && window.innerWidth < 940 ? null : depthLevel >
  //                 0 && window.innerWidth > 940 ? (
  //               <span>&raquo;</span>
  //             ) : (
  //               <span className="arrow" />
  //             )}
  //           </button>
  //           <Dropdown
  //             depthLevel={depthLevel}
  //             submenus={items.submenu}
  //             dropdown={dropdown}
  //           />
  //         </>
  //       ) : !items.url && items.submenu ? (
  //         <>
  //           <button
  //             type="button"
  //             aria-haspopup="menu"
  //             aria-expanded={dropdown ? "true" : "false"}
  //             onClick={() => setDropdown((prev) => !prev)}
  //           >
  //             {items.title}{" "}
  //             {depthLevel > 0 ? (
  //               <span>&raquo;</span>
  //             ) : (
  //               <span className="arrow" />
  //             )}
  //           </button>
  //           <Dropdown
  //             depthLevel={depthLevel}
  //             submenus={items.submenu}
  //             dropdown={dropdown}
  //           />
  //         </>
  //       ) : (
  //         <a
  //           href={items.url}
  //           onClick={handleClick} // Use handleClick to force reload
  //           className={window.location.pathname === items.url ? "active" : ""}
  //         >
  //           {items.title}
  //         </a>
  //       )}
  //     </li>
  //   </>
  // );
  const [buttonStyle, setButtonStyle] = useState({
    fontSize: "1rem",
    padding: "10px 15px",
  });

  useEffect(() => {
    const updateButtonStyle = () => {
      if (window.innerWidth >= 1200) {
        setButtonStyle({ fontSize: "0.75rem" }); // Large screens
      } else if (window.innerWidth >= 992) {
        setButtonStyle({ fontSize: "0.65rem" }); // Medium screens
      }
    };

    // Set initial styles
    updateButtonStyle();

    // Add resize event listener
    window.addEventListener("resize", updateButtonStyle);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateButtonStyle);
    };
  }, []);

  return (
    <>
      <li
        className="menu-items"
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={closeDropdown}
        style={{
          position: "relative",
          // border: "1px solid brown",
          // fontSize: fontSize,,
        }}
      >
        {tooltipVisible && items.tooltip && (
          <div
            style={{
              ...styleTooltip,
              visibility: tooltipVisible ? "visible" : "hidden",
              left: left ? "-40%" : "90%",
            }}
          >
            {items.tooltip}
          </div>
        )}
        {items.url && items.submenu ? (
          <>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={dropdown ? "true" : "false"}
              onClick={() => setDropdown((prev) => !prev)}
            >
              {window.innerWidth < 940 && depthLevel === 0 ? (
                items.title
              ) : (
                <Link onClick={handleClick} to={items.url}>
                  {items.title}
                </Link>
              )}
              {depthLevel > 0 && window.innerWidth < 940 ? null : depthLevel >
                  0 && window.innerWidth > 940 ? (
                <span>&raquo;</span>
              ) : (
                <span className="arrow" />
              )}
            </button>
            <Dropdown
              depthLevel={depthLevel}
              submenus={items.submenu}
              dropdown={dropdown}
            />
          </>
        ) : !items.url && items.submenu ? (
          <>
            <button
              type="button"
              style={{
                ...buttonStyle, // Apply dynamic button styles
              }}
              aria-haspopup="menu"
              aria-expanded={dropdown ? "true" : "false"}
              onClick={() => setDropdown((prev) => !prev)}
            >
              {items.title}
              {depthLevel > 0 ? (
                <span>&raquo;</span>
              ) : (
                <span className="arrow" />
              )}
            </button>
            <Dropdown
              depthLevel={depthLevel}
              submenus={items.submenu}
              dropdown={dropdown}
            />
          </>
        ) : (
          <Link onClick={handleClick} to={items.url}>
            {items.title}
          </Link>
        )}
      </li>
    </>
  );
};

export default MenuItems;
