import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdMenu, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import theme from "../../theme/theme";
import SidebarItems from "../SidebarItem";
import { getStoredAuthUser } from "../../helpers/auth_helper";
import MainLogo from "../../assets/images/DashboardImages/main_logo.svg";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (authUser?.user) {
      setUser(authUser.user);
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
          {/* {sidebarOpen && <CompanyName>A Project</CompanyName>} */}
        </LogoSection>
        <SidebarNav>
          {SidebarItems.map((item, index) => {
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
                      const isSubActive =
                        current === target || current.startsWith(target);
                      return (
                        <SubMenuItem
                          key={subIndex}
                          $isactive={isSubActive}
                          onClick={() => navigate(subItem.path)}
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
            <Hamburger onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MdMenu />
            </Hamburger>
            <TextWrap>
              <HeaderTitle>{getPageTitle()}</HeaderTitle>
              <SubHead></SubHead>
            </TextWrap>
          </CoverLeft>
          <RightCover>
            <Profile src={""} alt="profile" />
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
  width: ${(props) => (props.open ? "16.25rem" : "90px")};
  background-color: #ffffff;
  color: ${theme.colors.white};
  transition: width 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 2.5rem 0;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};
  gap: ${(props) => (props.open ? "0.75rem" : "0")};
`;

const Logo = styled.img`
  height: ${(props) => (props.open ? "2rem" : "2rem")};
  width: auto;
  object-fit: contain;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
    display: ${(props) => (props.open ? "inline" : "none")};
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
  transition: margin-left 0.3s ease-in-out;
  height: 100vh;
  overflow: hidden;
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
  // height: 602.27px;
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
