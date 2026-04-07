import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Tree, TreeNode } from "react-organizational-chart";
import theme from "../../theme/theme";
import HierarchyCard from "../../components/HierarchyCard";
import HierarchyIcon from "../../assets/images/Hierarchy/hierarchyIcon.svg";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";

const Hierarchy = () => {
  const ceoData = {
    name: "Manoj Kumar",
    employeeId: "EMP001",
    department: "Executive Board",
    position: "Chief Executive Officer",
    profileImage: ProfileImage,
  };

  const topLevelManagers = [
    {
      name: "Marcus Wright",
      employeeId: "EMP001",
      department: "Finance Department",
      position: "Head of Finance",
      profileImage: ProfileImage,
    },
    {
      name: "Sarah Jenkins",
      employeeId: "EMP001",
      department: "Operations Unit",
      position: "Operations Director",
      profileImage: ProfileImage,
    },
    {
      name: "Manoj Kumar",
      employeeId: "EMP001",
      department: "Executive Board",
      position: "Chief Executive Officer",
      profileImage: ProfileImage,
    },
    {
      name: "Manoj Kumar",
      employeeId: "EMP001",
      department: "Executive Board",
      position: "Chief Executive Officer",
      profileImage: ProfileImage,
    },
  ];

  const secondLevelManagers = [
    {
      name: "Sarah Jenkins",
      employeeId: "EMP001",
      department: "Operations Unit",
      position: "Operations Director",
      profileImage: ProfileImage,
    },
    {
      name: "Marcus Wright",
      employeeId: "EMP001",
      department: "Finance Department",
      position: "Head of Finance",
      profileImage: ProfileImage,
    },
  ];

  return (
    <Container>
      <Header>
        <IconWrapper>
          <Icon src={HierarchyIcon} alt="hierarchy" />
        </IconWrapper>
        <Title>Hierarchy</Title>
      </Header>

      <HierarchyContainer>
        <Tree
          lineWidth="2px"
          lineColor={theme.colors.border}
          lineBorderRadius="10px"
          label={<CardWrapper><HierarchyCard {...ceoData} /></CardWrapper>}
        >
          {topLevelManagers.map((manager, index) => (
            <TreeNode key={index} label={<CardWrapper><HierarchyCard {...manager} /></CardWrapper>}>
              {index < 2 && secondLevelManagers[index] && (
                <TreeNode label={<CardWrapper><HierarchyCard {...secondLevelManagers[index]} /></CardWrapper>} />
              )}
            </TreeNode>
          ))}
        </Tree>
      </HierarchyContainer>
    </Container>
  );
};

export default Hierarchy;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
  background-color: ${theme.colors.white};
  padding: 1.25rem;
  border-radius: 0.625rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

const Title = styled.h1`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 160%;
  letter-spacing: 0%;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const HierarchyContainer = styled.div`
  padding: 2rem 0;
  overflow-x: auto;
  
  /* Customize the tree lines */
  .rst__tree {
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  display: inline-block;
`;
