import MenuItems from "./MenuItems";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { UserRoleAccessContext } from "../context/Appcontext";

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  const { buttonStyles } = useContext(UserRoleAccessContext);
  const [left, setLeft] = useState(false);
  const [maintainLeft, setMaintainLeft] = useState(false);
  const submenuRef = useRef(null);
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";
  // useEffect(() => {
  //   if (
  //     document.documentElement.scrollWidth >
  //     document.documentElement.clientWidth
  //   ) {
  //     if (depthLevel >= 1) {
  //       setLeft(true);
  //       setMaintainLeft(true);
  //     } else if (depthLevel <= 1) {
  //       setLeft(false);
  //     }
  //   } else if (
  //     document.documentElement.scrollWidth ===
  //     document.documentElement.clientWidth &&
  //     depthLevel < 1
  //   ) {
  //     setLeft(false);
  //   } else {
  //     setMaintainLeft(false);
  //   }
  // }, [dropdown, depthLevel, window.innerWidth]);
  // useEffect(() => {
  //   const handleWheel = (event) => {
  //     if (event.ctrlKey) {
  //       setLeft(false);
  //     }
  //   };

  //   window.addEventListener("wheel", handleWheel);
  // }, []);

  const updateMenuPosition = useCallback(() => {
    if (submenuRef.current) {
      const { right } = submenuRef.current.getBoundingClientRect();
      const isHidden = right > window.innerWidth;

      // Only set to the right side if the submenu is going to be hidden off-screen
      // This ensures it doesn't toggle unnecessarily
      if (isHidden && !left) {
        setLeft(true);
      } else if (!isHidden && left) {
        setLeft(false);
      }
    }
  }, []);  // `left` state is now used to check the last applied state

  useEffect(() => {
    if (dropdown) {
      updateMenuPosition();
    }
    window.addEventListener("resize", updateMenuPosition);

    return () => window.removeEventListener("resize", updateMenuPosition);
  }, [dropdown, updateMenuPosition]);

  return (
    <>
      {/* {left && depthLevel > 2 ? (
        <ul
          className={`dropdown dropdown-straightmenu ${dropdown ? "show" : ""}`}
        // style={{ ...buttonStyles.navbar }}
        >
          {submenus.map((submenu, index) => (
            <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
          ))}
        </ul>
      ) : left ? (
        <ul
          className={`dropdown dropdown-rightmenu ${dropdown ? "show" : ""}`}
        // style={{ ...buttonStyles.navbar }}
        >
          {submenus.map((submenu, index) => (
            <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
          ))}
        </ul>
      ) : (
        <ul
          className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}
        // style={{ ...buttonStyles.navbar }}
        >
          {submenus.map((submenu, index) => (
            <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
          ))}
        </ul>
      )} */}
      <ul
        ref={submenuRef}
        className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""} ${left ? "dropdown-rightmenu" : ""
          }`}
      >
        {submenus.map((submenu, index) => (
          <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
        ))}
      </ul>
    </>
  );
};

export default Dropdown;
