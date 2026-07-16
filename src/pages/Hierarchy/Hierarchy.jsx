import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Tree, TreeNode } from "react-organizational-chart";
import theme from "../../theme/theme";
import HierarchyCard from "../../components/HierarchyCard";
import HierarchyIcon from "../../assets/images/Hierarchy/hierarchyIcon.svg";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import { get } from "../../helpers/api_helper";
import { GET_HIERARCHY_TREE } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const Hierarchy = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    setLoading(true);
    try {
      const response = await get(GET_HIERARCHY_TREE);
      console.log("Hierarchy data:", response);
      if (response && response.tree && response.tree.length > 0) {
        // API returns { tree: [...], totalNodes: number }
        // Use the first root node from the tree array
        setHierarchyData(response.tree[0]);
      }
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      toast.error("Failed to fetch hierarchy data");
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to match component structure
  const transformTreeNode = (node) => {
    if (!node) return null;
    
    return {
      name: node.name || "N/A",
      employeeId: node.employeeId || "N/A",
      department: node.department || "N/A",
      position: node.designation || "N/A",
      profileImage: node.profilePic || ProfileImage,
      children: (node.children || []).map(child => transformTreeNode(child)),
    };
  };

  // Use API data if available, otherwise use fallback
  const ceoData = hierarchyData 
    ? transformTreeNode(hierarchyData)
    : {
        name: "Manoj Kumar",
        employeeId: "EMP001",
        department: "Executive Board",
        position: "Chief Executive Officer",
        profileImage: ProfileImage,
      };

  // Recursive function to render tree nodes
  const renderTreeNode = (node) => {
    if (!node) return null;

    return (
      <TreeNode key={node.employeeId} label={<CardWrapper><HierarchyCard {...node} /></CardWrapper>}>
        {node.children && node.children.length > 0 && node.children.map((child) => renderTreeNode(child))}
      </TreeNode>
    );
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <IconWrapper>
            <Icon src={HierarchyIcon} alt="hierarchy" />
          </IconWrapper>
          <Title>Hierarchy</Title>
        </Header>
        <LoadingContainer>Loading hierarchy data...</LoadingContainer>
      </Container>
    );
  }

  const topLevelChildren = ceoData?.children || [];

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
          {topLevelChildren.map((manager, index) => renderTreeNode(manager))}
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: 1rem;
  color: ${theme.colors.secondaryTextColor};
  font-family: "Inter", sans-serif;
`;
