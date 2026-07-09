import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdMenu, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import theme from "../../theme/theme";
import SidebarItems from "../SidebarItem";
import { getStoredAuthUser } from "../../helpers/auth_helper";
import MainLogo from "../../assets/images/DashboardImages/main_logo.svg";

// Helper function to check if user has permission for a module
const hasModulePermission = (permissions, moduleKey) => {
  if (!permissions || permissions.length === 0) return true;

  for (const group of permissions) {
    const module = group.modules?.find((m) => m.module === moduleKey);
    if (module && module.enabled && module.permissions?.view) {
      return true;
    }
  }
  return false;
};

// Helper function to get module key from menu item name
// This matches sidebar menu names to permission module names
const getModuleKeyFromMenuItem = (menuName, isSubmenu = false, submenuName = null) => {
  const nameToModuleMap = {
    // Top-level menus
    Dashboard: "dashboard",
    Announcement: "announcement",
    Contractors: "contractorOverview", // Parent key
    "People Hub": "onboarding", // Parent key
    "Time Hub": "attendance", // Parent key
    "Pay Hub": "payroll", // Parent key
    Settings: "generalSettings", // Parent key
  };

  const submenuNameToModuleMap = {
    // Contractor submenus
    Overview: "contractorOverview",
    Contractors: "contractorContractors",
    Payments: "contractorPayments",
    // People Hub submenus
    Onboarding: "onboarding",
    Employees: "employees",
    Agents: "agents",
    Teams: "teams",
    Branch: "branch",
    Hierarchy: "hierarchy",
    "Off-Boarding": "offBoarding",
    // Time Hub submenus
    Attendance: "attendance",
    "Leave Attendance": "leaveAttendance",
    "Shift Management": "shiftManagement",
    "Overtime Management": "overtimeManagement",
    Leaderboard: "leaderboard",
    "Day Off & Holidays": "dayOffHolidays",
    // Pay Hub submenus
    Payroll: "payroll",
    Paysheet: "paysheet",
    "Stop Payroll": "stopPayroll",
    "Addition & Deductions": "additionDeductions",
    // Settings submenus
    "General Settings": "generalSettings",
    "Organization Details": "organizationDetails",
    "Day Settings": "daySettings",
    "Series Configuration": "seriesConfiguration",
    Departments: "departments",
    Roles: "roles",
  };

  if (isSubmenu && submenuName) {
    return submenuNameToModuleMap[submenuName];
  }

  return nameToModuleMap[menuName];
};

// Filter sidebar items based on permissions
const filterSidebarItems = (items, userPermissions) => {
  return items
    .map((item) => {
      // Get module key for parent item
      const parentModuleKey = getModuleKeyFromMenuItem(item.name, false);

      if (item.submenu && item.submenu.length > 0) {
        // For parent items with submenus, filter submenu items
        const filteredSubmenu = item.submenu.filter((subItem) => {
          const subModuleKey = getModuleKeyFromMenuItem(item.name, true, subItem.name);
          return hasModulePermission(userPermissions, subModuleKey);
        });

        // Return parent only if at least one submenu item has permission
        if (filteredSubmenu.length > 0) {
          return {
            ...item,
            submenu: filteredSubmenu,
          };
        }
        return null;
      } else {
        // For parent items without submenus, check permission directly
        if (hasModulePermission(userPermissions, parentModuleKey)) {
          return item;
        }
        return null;
      }
    })
    .filter(Boolean);
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState({});
  const [visibleSidebarItems, setVisibleSidebarItems] = useState(SidebarItems);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (authUser?.user) {
      setUser(authUser.user);

      // Admin users see all sidebar items without filtering
      if (authUser.user.role === 'admin') {
        console.log('✅ Admin user detected - showing all sidebar items');
        setVisibleSidebarItems(SidebarItems);
        return;
      }

      // Get permissions from localStorage (stored during login)
      try {
        const storedPermissions = localStorage.getItem('userPermissions');
        if (storedPermissions) {
          const permissions = JSON.parse(storedPermissions);
          console.log('Permissions loaded from localStorage:', permissions);
          
          const filteredItems = filterSidebarItems(SidebarItems, permissions);
          setVisibleSidebarItems(filteredItems);
          console.log('Sidebar filtered with user permissions');
        } else {
          console.log('No permissions in localStorage, showing all sidebar items');
        }
      } catch (error) {
        console.error('Error parsing permissions from localStorage:', error);
      }
    }
  }, []);

  const toggleSubmenu = (name, isExpanded) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [name]: !isExpanded,
    }));
  };

  const getPageTitle = () => {
    const path = location.pathname.replace(/\/+$/, "");
    const segment = path.split("/").filter(Boolean).pop() || "dashboard";
    const spaced = segment
      .replace(/[-_]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
    const name = spaced.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    return name;
  };

  return (
    <LayoutContainer>
      <Sidebar
        open={sidebarOpen}
        $isCreateCustomer={location.pathname.includes("/customer/add-customer")}
      >
        <LogoSection
          open={sidebarOpen}
          onClick={() => navigate("/admin/dashboard")}
        >
          <Logo src={MainLogo} alt="Logo" open={sidebarOpen} />
        </LogoSection>
        <SidebarNav>
          {visibleSidebarItems.map((item, index) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isParentActive =
              hasSubmenu &&
              item.submenu.some(
                (sub) =>
                  location.pathname === sub.path ||
                  location.pathname.startsWith(sub.path),
              );
            const isActive = item.path
              ? location.pathname === item.path
              : isParentActive;
            const isExpanded =
              expandedMenu[item.name] !== undefined
                ? expandedMenu[item.name]
                : isParentActive;

            return (
              <React.Fragment key={index}>
                <SidebarItem
                  $isactive={isActive}
                  open={sidebarOpen}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.name, isExpanded);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <ItemContent>
                    <img
                      src={isActive ? item.iconDark : item.icon}
                      alt={item.name || "icon"}
                    />
                    <span>{item.name}</span>
                  </ItemContent>
                  {hasSubmenu && sidebarOpen && (
                    <ArrowIcon>
                      {isExpanded ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </ArrowIcon>
                  )}
                </SidebarItem>
                {hasSubmenu && isExpanded && sidebarOpen && (
                  <SubMenuContainer>
                    {item.submenu.map((subItem, subIndex) => {
                      const current = location.pathname.replace(/\/+$/, "");
                      const target = (subItem.path || "").replace(/\/+$/, "");

                      let isSubActive = current === target;

                      if (subItem.name === "Employees") {
                        isSubActive =
                          current === target ||
                          (current === "/admin/peopleHub/employees/create" &&
                            location.state?.from === "employees");
                      } else if (subItem.name === "Onboarding") {
                        isSubActive =
                          current === target ||
                          (current === "/admin/peopleHub/employees/create" &&
                            location.state?.from === "onboarding");
                      }

                      return (
                        <SubMenuItem
                          key={subIndex}
                          $isactive={isSubActive}
                          onClick={() => {
                            if (subItem.state) {
                              navigate(subItem.path, { state: subItem.state });
                            } else {
                              navigate(subItem.path);
                            }
                          }}
                        >
                          <span>{subItem.name}</span>
                        </SubMenuItem>
                      );
                    })}
                  </SubMenuContainer>
                )}
              </React.Fragment>
            );
          })}
        </SidebarNav>
      </Sidebar>
      <MainContent open={sidebarOpen}>
        <Header>
          <CoverLeft>
            <Hamburger
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Sidebar is fixed width"
            >
              <MdMenu />
            </Hamburger>
            <TextWrap>
              <HeaderTitle>{getPageTitle()}</HeaderTitle>
              <SubHead></SubHead>
            </TextWrap>
          </CoverLeft>
          <RightCover>
            <Profile src={null} alt="profile" />
            <TextWrap>
              <Name>{user?.name || user?.username || "Admin"}</Name>
              <Role>{user?.role || "Admin"}</Role>
            </TextWrap>
          </RightCover>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 16.25rem;
  min-width: 16.25rem;
  max-width: 16.25rem;
  background-color: #ffffff;
  color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: relative;
  transition: transform 0.3s ease, margin-left 0.3s ease;
  transform: ${(props) => (props.open ? "translateX(0)" : "translateX(-100%)")};
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 2.5rem 0;
  justify-content: flex-start;
  gap: 0.75rem;
`;

const Logo = styled.img`
  height: 2rem;
  width: auto;
  object-fit: contain;
  cursor: pointer;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SidebarItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.938rem;
  border: none;
  border-radius: 4px;
  margin: 0 0 0.625rem 0;
  cursor: pointer;
  white-space: nowrap;

  background-color: ${(props) =>
    props.$isactive ? theme.colors.primary : "transparent"};

  span {
    color: ${(props) => (props.$isactive ? theme.colors.white : "#1B2436")};
    display: inline;
    transition: opacity 0.3s ease;
  }

  img {
    filter: ${(props) =>
      props.$isactive ? "brightness(0) invert(1)" : "none"};
    transition: filter 0.3s ease;
  }

  &:hover {
    background-color: ${(props) =>
      props.$isactive ? theme.colors.primary : "transparent"};

    span {
      color: ${(props) => (props.$isactive ? theme.colors.white : "#1B2436")};
    }

    img {
      filter: ${(props) =>
        props.$isactive ? "brightness(0) invert(1)" : "none"};
    }
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;

  span {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 160%;
  }

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ArrowIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.textColor};
  font-size: 1.25rem;
`;

const SubMenuContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: -0.5rem 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SubMenuItem = styled.li`
  padding: 0.5rem 0.938rem 0.5rem 3rem;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$isactive ? theme.colors.primary : "transparent"};

  span {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 160%;
    color: ${(props) => (props.$isactive ? theme.colors.white : "#1B2436")};
  }

  &:hover {
    background-color: ${(props) =>
      props.$isactive ? theme.colors.primary : "#f7fafc"};
    span {
      color: ${(props) =>
        props.$isactive ? theme.colors.white : theme.colors.primary};
    }
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.open ? "0" : "-16.25rem")};
`;

const Header = styled.header`
  background-color: ${theme.colors.bgColor};
  padding: 1.25rem;
  border-bottom: 1px solid #e0e3e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
`;

const CoverLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Hamburger = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.textColor};
`;

const HeaderTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0 0;
`;

const Content = styled.main`
  flex-grow: 1;
  padding: 1.25rem;
  background-color: ${theme.colors.bgColor};
  overflow-y: auto;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SubHead = styled.p`
  font-size: 1rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0 0;
`;

const RightCover = styled.div`
  display: flex;
  align-items: center;
  gap: 0.688rem;
`;

const Profile = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
`;

const Name = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0 0;
`;

const Role = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  line-height: 160%;
  color: ${theme.colors.secondaryTextColor};
  margin: 0 0 0 0;
`;

export default AdminLayout;
