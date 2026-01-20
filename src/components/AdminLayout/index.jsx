import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import theme from "../../theme/theme";
import SidebarItems from "../SidebarItem";
import { getStoredAuthUser } from "../../helpers/auth_helper";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (authUser?.user) {
      setUser(authUser.user);
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("customer")) return "Customer Management";
    if (path.includes("role-management")) return "Role Management";
    if (path.includes("sales-representatives")) return "Sales Representatives";
    if (path.includes("deliveries")) return "Deliveries";
    if (path.includes("payments")) return "Payments";
    if (path.includes("add-payment")) return "Add Payment";
    if (path.includes("reports")) return "Reports";
    if (path.includes("settings")) return "Settings";
    if (path.includes("location")) return "Location Management";
    return "Dashboard";
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
          <Logo src={""} alt="Rice Mill Logo" open={sidebarOpen} />
          {sidebarOpen && <CompanyName>A Project</CompanyName>}
        </LogoSection>
        <SidebarNav>
          {SidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarItem
                key={index}
                $isactive={isActive}
                open={sidebarOpen}
                onClick={() => navigate(item.path)}
              >
                <img
                  src={isActive ? item.iconDark : item.icon}
                  alt={item.name || "icon"}
                />
                <span>{item.name}</span>
              </SidebarItem>
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
  filter: brightness(0) saturate(100%) invert(56%) sepia(18%) saturate(1612%)
    hue-rotate(75deg) brightness(95%) contrast(89%);
  cursor: pointer;
`;

const CompanyName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  line-height: 140%;
  margin: 0;
  color: ${theme.colors.primary} !important;
  white-space: nowrap;
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
  padding: 0.75rem 0.938rem;
  border: none;
  border-radius: 4px;
  margin: 0 0 0.625rem 0;
  gap: ${(props) => (props.open ? "0.625rem" : "0")};
  cursor: pointer;
  justify-content: ${(props) => (props.open ? "flex-start" : "center")};
  white-space: nowrap;

  span {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 160%;
    letter-spacing: 0%;
    color: #000000;
    display: ${(props) => (props.open ? "inline" : "none")};
    transition: opacity 0.3s ease;
  }

  background-color: ${(props) =>
    props.$isactive ? theme.colors.primary : "transparent"};

  span {
    color: ${(props) => (props.$isactive ? theme.colors.white : "#1B2436")};
  }

  img {
    width: 1.5rem;
    height: 1.5rem;
    transition: filter 0.3s ease;
    filter: ${(props) =>
      props.$isactive
        ? "brightness(0) invert(1)"
        : "brightness(0) saturate(100%) invert(56%) sepia(18%) saturate(1612%) hue-rotate(75deg) brightness(95%) contrast(89%)"};
  }

  &:hover {
    background-color: ${(props) =>
      props.$isactive ? theme.colors.primary : "transparent"};

    span {
      color: ${(props) => (props.$isactive ? theme.colors.white : "#1B2436")};
    }

    img {
      filter: ${(props) =>
        props.$isactive
          ? "brightness(0) invert(1)"
          : "brightness(0) saturate(100%) invert(56%) sepia(18%) saturate(1612%) hue-rotate(75deg) brightness(95%) contrast(89%)"};
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
