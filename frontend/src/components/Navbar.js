import React, { useState, useContext, useEffect } from "react";
import { menuItems } from "./menuItemsList";
import MenuItems from "./MenuItems";
import { UserRoleAccessContext } from "../context/Appcontext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import { SERVICE } from "../services/Baseservice";
import axios from "axios";
import { AuthContext } from "../context/Appcontext";

const Navbar = () => {
  const { auth } = useContext(AuthContext);
  const [filterSidebar, setFilterSidebar] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const roleAccess = isUserRoleCompare;
  let ans;

  useEffect(() => {
    const fetchFilterSidebarItems = async () => {
      try {
        let roleSidebar = menuItems.filter((item) => {
          ans = roleAccess.includes(item.dbname);
          return ans;
        });

        let roleBasedSidebar = roleSidebar.map((item) => {
          if (item.submenu) {
            let roleBasedChild = item.submenu.filter((item) => {
              ans = roleAccess.includes(item.dbname);
              return ans;
            });

            let childrenbasedChild = roleBasedChild.map((value) => {
              if (value.submenu) {
                let roleBasedinnerChild = value.submenu.filter((item) => {
                  ans = roleAccess.includes(item.dbname);
                  return ans;
                });

                let childrenbasedInnerChild = roleBasedinnerChild.map(
                  (innerValue) => {
                    if (innerValue.submenu) {
                      let roleBasedInnermostChild = innerValue.submenu.filter(
                        (item) => {
                          ans = roleAccess.includes(item.dbname);
                          return ans;
                        }
                      );

                      let childrenbasedInnermostChild =
                        roleBasedInnermostChild.map((innermostValue) => {
                          if (innermostValue.submenu) {
                            let roleBasedInnermostChild1 =
                              innermostValue.submenu.filter((item) => {
                                ans = roleAccess.includes(item.dbname);
                                return ans;
                              });

                            let childrenbasedInnermostChild1 =
                              roleBasedInnermostChild1.map(
                                (innermostValue1) => {
                                  if (innermostValue1.submenu) {
                                    let roleBasedInnermostChild2 =
                                      innermostValue1.submenu.filter((item) => {
                                        ans = roleAccess.includes(item.dbname);
                                        return ans;
                                      });
                                  } else {
                                    return innermostValue1;
                                  }
                                }
                              );

                            return {
                              ...innermostValue,
                              submenu: childrenbasedInnermostChild1,
                            };
                          } else {
                            return innermostValue;
                          }
                        });

                      return {
                        ...innerValue,
                        submenu: childrenbasedInnermostChild,
                      };
                    } else {
                      return innerValue;
                    }
                  }
                );

                return { ...value, submenu: childrenbasedInnerChild };
              } else {
                return value;
              }
            });

            return { ...item, submenu: childrenbasedChild };
          } else {
            return item;
          }
        });

        let res = await axios.get(`${SERVICE.TOOLTIPDESCRIPTIONS}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        // for tooltip showing
        let mappedDatas = res?.data?.tooldescription?.map((data) => ({
          ...data,
          commonname: `${data.modulename}-${data.submodulename}-${
            data.mainpagename ? data.mainpagename : ""
          }-${data.subpagename ? data.subpagename : ""}-${
            data.subsubpagename ? data.subsubpagename : ""
          }`,
        }));

        let combinedDatas = roleBasedSidebar?.map((data) => {
          return {
            ...data,
            submenu: data?.submenu?.map((itemfirst) => {
              if (itemfirst?.submenu && itemfirst?.submenu?.length > 0) {
                return {
                  ...itemfirst,
                  submenu: itemfirst?.submenu?.map((itemsecond) => {
                    if (
                      itemsecond?.submenu &&
                      itemsecond?.submenu?.length > 0
                    ) {
                      return {
                        ...itemsecond,
                        submenu: itemsecond?.submenu?.map((itemthird) => {
                          if (
                            itemthird?.submenu &&
                            itemthird?.submenu?.length > 0
                          ) {
                            return {
                              ...itemthird,
                              submenu: itemthird?.submenu?.map((itemfourth) => {
                                if (
                                  itemfourth?.submenu &&
                                  itemfourth?.submenu?.length > 0
                                ) {
                                  return itemfourth;
                                } else {
                                  let foundData = mappedDatas?.find(
                                    (item) =>
                                      item.commonname ===
                                      `${data?.title}-${itemfirst?.title}-${itemsecond?.title}-${itemthird?.title}-${itemfourth?.title}`
                                  );
                                  return {
                                    ...itemfourth,
                                    tooltip: foundData
                                      ? foundData?.description
                                      : "",
                                  };
                                }
                              }),
                            };
                          } else {
                            let foundData = mappedDatas?.find(
                              (item) =>
                                item.commonname ===
                                `${data?.title}-${itemfirst?.title}-${itemsecond?.title}-${itemthird?.title}-`
                            );
                            return {
                              ...itemthird,
                              tooltip: foundData ? foundData?.description : "",
                            };
                          }
                        }),
                      };
                    } else {
                      let foundData = mappedDatas?.find(
                        (item) =>
                          item.commonname ===
                          `${data?.title}-${itemfirst?.title}-${itemsecond?.title}--`
                      );
                      return {
                        ...itemsecond,
                        tooltip: foundData ? foundData?.description : "",
                      };
                    }
                  }),
                };
              } else {
                let foundData = mappedDatas?.find(
                  (item) =>
                    item.commonname === `${data?.title}-${itemfirst?.title}---`
                );
                return {
                  ...itemfirst,
                  tooltip: foundData ? foundData?.description : "",
                };
              }
            }),
          };
        });

        setFilterSidebar(combinedDatas);
      } catch (err) {
        console.error(err?.response?.data?.message);
      }
    };

    fetchFilterSidebarItems();
  }, [roleAccess]);

  const theme = createTheme(); // Create an empty theme object

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const toggleMobileMenu = (event) => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setMobileMenuAnchor(null);
  };

  const isScreenSize930px = useMediaQuery("(min-width: 1100px)");

  return (
    <>
      <Toolbar>
        {isScreenSize930px ? (
          <nav className="menu-nav">
            <ul
              className="menus"
              style={{
                position: "relative",
                // border: "1px solid black",
              }}
            >
              {filterSidebar.map((menu, index) => (
                <MenuItems
                  key={index}
                  items={menu}
                  depthLevel={0}
                  isMobileMenuOpen={false}
                />
              ))}
            </ul>
          </nav>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <List>
          {filterSidebar.map((menu, index) => (
            <NestedMenu
              key={index}
              menu={menu}
              depthLevel={0}
              isMobileMenu
              handleMobileMenuClose={handleMobileMenuClose}
            />
          ))}
        </List>
      </Drawer>
    </>
    // </ThemeProvider>
  );
};

const NestedMenu = ({
  menu,
  depthLevel,
  isMobileMenu,
  handleMobileMenuClose,
  parentUrl = "",
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  const isExpandable = menu.submenu && menu.submenu.length > 0;

  const handleMenuItemClick = (url) => {
    navigate(url);
    handleMobileMenuClose();
  };

  return (
    <>
      <ListItem
        button
        onClick={
          isExpandable ? handleClick : () => handleMenuItemClick(menu.url)
        }
        style={{
          paddingLeft: `${depthLevel * 20}px`,
          minWidth: "270px",
          backgroundColor: isExpandable ? "#8080805e" : "#F5F5F5",
          paddingLeft: isExpandable ? "10px" : `${depthLevel * 20}px`,
        }}
      >
        {depthLevel > 0 && !isExpandable && (
          <FiberManualRecordIcon
            style={{ marginRight: "8px", fontSize: "10px" }}
          />
        )}
        {menu.icon && <ListItemIcon>{menu.icon}</ListItemIcon>}
        <ListItemText primary={menu.title} />
        {isExpandable &&
          (isMobileMenu ? (
            open ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )
          ) : (
            <ArrowRightIcon />
          ))}
      </ListItem>

      {isExpandable && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.submenu.map((submenu, index) => (
              <NestedMenu
                key={index}
                menu={submenu}
                depthLevel={depthLevel + 1}
                isMobileMenu={isMobileMenu}
                handleMobileMenuClose={handleMobileMenuClose}
                parentUrl={menu.url}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default Navbar;
