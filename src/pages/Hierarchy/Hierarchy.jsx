import styled from "styled-components";
import { Tree, TreeNode } from "react-organizational-chart";
import theme from "../../theme/theme";
import HierarchyCard from "../../components/HierarchyCard";
import HierarchyIcon from "../../assets/images/Hierarchy/hierarchyIcon.svg";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";

const hierarchyData = {
  name: "Manoj Kumar",
  employeeId: "EMP001",
  department: "Executive Board",
  position: "Chief Executive Officer",
  profileImage: ProfileImage,
  children: [
    {
      name: "Marcus Wright",
      employeeId: "EMP002",
      department: "Finance Department",
      position: "Head of Finance",
      profileImage: ProfileImage,
    },
    {
      name: "Sarah Jenkins",
      employeeId: "EMP003",
      department: "Operations Unit",
      position: "Operations Director",
      profileImage: ProfileImage,
      children: [
        {
          name: "Ava Williams",
          employeeId: "EMP006",
          department: "Operations Unit",
          position: "Operations Manager",
          profileImage: ProfileImage,
        },
      ],
    },
    {
      name: "David Miller",
      employeeId: "EMP004",
      department: "Executive Board",
      position: "Technical Director",
      profileImage: ProfileImage,
    },
    {
      name: "Emily Clark",
      employeeId: "EMP005",
      department: "People Department",
      position: "Head of People",
      profileImage: ProfileImage,
      children: [
        {
          name: "Noah Brown",
          employeeId: "EMP007",
          department: "People Department",
          position: "HR Manager",
          profileImage: ProfileImage,
        },
      ],
    },
  ],
};

const renderTreeNode = (node) => (
  <TreeNode
    key={node.employeeId}
    label={<CardWrapper><HierarchyCard {...node} /></CardWrapper>}
  >
    {node.children?.map(renderTreeNode)}
  </TreeNode>
);

const Hierarchy = () => (
  <Container>
    <Header>
      <IconWrapper><Icon src={HierarchyIcon} alt="" /></IconWrapper>
      <Title>Hierarchy</Title>
    </Header>

    <HierarchyContainer>
      <TreeViewport>
        <Tree
          lineWidth="1px"
          lineColor={theme.colors.border}
          lineBorderRadius="0"
          nodePadding="25px"
          label={<CardWrapper><HierarchyCard {...hierarchyData} /></CardWrapper>}
        >
          {hierarchyData.children.map(renderTreeNode)}
        </Tree>
      </TreeViewport>
    </HierarchyContainer>
  </Container>
);

export default Hierarchy;

const Container = styled.section`
  width: 100%;
  min-height: 894px;
  padding: 18px 20px 30px;
  box-sizing: border-box;
  background: ${theme.colors.white};
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  height: 64px;
  padding-bottom: 18px;
  box-sizing: border-box;
  border-bottom: 1px solid ${theme.colors.border};
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  background: #edf6f9;
  border-radius: 8px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
`;

const HierarchyContainer = styled.div`
  width: 100%;
  overflow: auto;
  padding: 39px 0 60px;
  box-sizing: border-box;
`;

const TreeViewport = styled.div`
  min-width: 1018px;

  ul { padding-top: 50px; }
  li::before, li::after { height: 50px; }
  ul ul::before { height: 50px; }
`;

const CardWrapper = styled.div`
  display: inline-block;
`;
