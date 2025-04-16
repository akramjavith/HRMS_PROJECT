import MenuItems from './MenuItems';
import {useEffect,useState} from "react";

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  const [left,setLeft] = useState(false);
  const [maintainLeft,setMaintainLeft]=useState(false);
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : '';
  useEffect(()=>{
    if (document.documentElement.scrollWidth>document.documentElement.clientWidth){
      if (depthLevel >= 1){
        setLeft(true);
        setMaintainLeft(true);
      }
      else if (depthLevel <= 1){
        setLeft(false);
      }
    }
    else if (document.documentElement.scrollWidth===document.documentElement.clientWidth && depthLevel<1) {
      setLeft(false);
    }
    else{
      setMaintainLeft(false);
    }
  },[dropdown,depthLevel,window.innerWidth])
  useEffect(() => {
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        setLeft(false);
      }
    };

    window.addEventListener('wheel', handleWheel);

  }, []);
  return (
    <>
    {left && depthLevel > 2 ? (
      <ul
        className={`dropdown dropdown-straightmenu ${
          dropdown ? 'show' : ''
        }`}
      >
        {submenus.map((submenu, index) => (
          <MenuItems
            items={submenu}
            key={index}
            depthLevel={depthLevel}
          />
        ))}
      </ul>
    ) : left ? (
      <ul
        className={`dropdown dropdown-rightmenu ${
          dropdown ? 'show' : ''
        }`}
      >
        {submenus.map((submenu, index) => (
          <MenuItems
            items={submenu}
            key={index}
            depthLevel={depthLevel}
          />
        ))}
      </ul>
    ) : (
      <ul
        className={`dropdown ${dropdownClass} ${
          dropdown ? 'show' : ''
        }`}
      >
        {submenus.map((submenu, index) => (
          <MenuItems
            items={submenu}
            key={index}
            depthLevel={depthLevel}
          />
        ))}
      </ul>
    )}
  </>

    
  );
};

export default Dropdown;