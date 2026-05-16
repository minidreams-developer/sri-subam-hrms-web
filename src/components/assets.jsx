import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoAdd, IoClose } from "react-icons/io5";

const Assets = () => {
  const [assets, setAssets] = useState([
    {
      id: 1,
      assetName: "Laptop",
      serialId: "SIN-123-456-596",
      issueDate: "14-01-2026",
      assetCondition: "Used",
      status: "Currently Using",
      statusColor: "#066C78",
      description: "Dell Laptop for development",
      category: "Electronics",
      purchaseDate: "10-01-2025",
      value: "₹75,000",
      assignedTo: "John Doe",
      department: "IT",
    },
    {
      id: 2,
      assetName: "Headphones",
      serialId: "KL-123-456",
      issueDate: "14-01-2026",
      assetCondition: "New",
      status: "Returned",
      statusColor: "#10B981",
      description: "Wireless Headphones",
      category: "Accessories",
      purchaseDate: "05-01-2025",
      value: "₹5,000",
      assignedTo: "Jane Smith",
      department: "HR",
    },
    {
      id: 3,
      assetName: "ID Card",
      serialId: "ID5806",
      issueDate: "14-01-2026",
      assetCondition: "New",
      status: "Not Returned",
      statusColor: "#EF4444",
      description: "Employee ID Card",
      category: "Documents",
      purchaseDate: "01-01-2025",
      value: "₹500",
      assignedTo: "Mike Johnson",
      department: "Admin",
    },
  ]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddAsset = () => {
    // TODO: Open modal to add new asset
    console.log("Add new asset");
  };

  const handleRowClick = (asset) => {
    setSelectedAsset(asset);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAsset(null);
  };

  const handleAction = (assetId, e) => {
    e.stopPropagation();
    // TODO: Handle action menu
    console.log("Action for asset:", assetId);
  };

  return (
    <>
      {!showDetails ? (
        <Container>
          <Header>
            <Title>
              <ListIcon>≡</ListIcon>
              Assets List
            </Title>
            <AddButton onClick={handleAddAsset}>
              <IoAdd size={18} />
              New Assets
            </AddButton>
          </Header>

          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Asset Name</TableHeader>
                  <TableHeader>Serial / Asset ID</TableHeader>
                  <TableHeader>Issue Date</TableHeader>
                  <TableHeader>Asset Condition</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id} onClick={() => handleRowClick(asset)}>
                    <TableCell>{asset.assetName}</TableCell>
                    <TableCell>{asset.serialId}</TableCell>
                    <TableCell>{asset.issueDate}</TableCell>
                    <TableCell>{asset.assetCondition}</TableCell>
                    <StatusCell statusColor={asset.statusColor}>
                      {asset.status}
                    </StatusCell>
                    <ActionCell onClick={(e) => handleAction(asset.id, e)}>
                      <ActionButton>⋯</ActionButton>
                    </ActionCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Container>
      ) : (
        <DetailsContainer>
          <DetailsHeader>
            <BackButton onClick={handleCloseDetails}>
              ← Back
            </BackButton>
            <DetailsTitle>Asset Details</DetailsTitle>
            <CloseButton onClick={handleCloseDetails}>
              <IoClose size={24} />
            </CloseButton>
          </DetailsHeader>

          <DetailsContent>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Asset Name</DetailLabel>
                <DetailValue>{selectedAsset?.assetName}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Serial / Asset ID</DetailLabel>
                <DetailValue>{selectedAsset?.serialId}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue>{selectedAsset?.category}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Asset Condition</DetailLabel>
                <DetailValue>{selectedAsset?.assetCondition}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Issue Date</DetailLabel>
                <DetailValue>{selectedAsset?.issueDate}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Purchase Date</DetailLabel>
                <DetailValue>{selectedAsset?.purchaseDate}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Asset Value</DetailLabel>
                <DetailValue>{selectedAsset?.value}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <StatusValue statusColor={selectedAsset?.statusColor}>
                  {selectedAsset?.status}
                </StatusValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Assigned To</DetailLabel>
                <DetailValue>{selectedAsset?.assignedTo}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Department</DetailLabel>
                <DetailValue>{selectedAsset?.department}</DetailValue>
              </DetailItem>

              <DetailItemFull>
                <DetailLabel>Description</DetailLabel>
                <DetailValue>{selectedAsset?.description}</DetailValue>
              </DetailItemFull>
            </DetailsGrid>

            <ActionButtons>
              <EditButton>Edit Asset</EditButton>
              <DeleteButton>Delete Asset</DeleteButton>
            </ActionButtons>
          </DetailsContent>
        </DetailsContainer>
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const ListIcon = styled.span`
  font-size: 1.5rem;
  color: ${theme.colors.primary};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.white};
`;

const TableHead = styled.thead`
  background-color: ${theme.colors.bgColor};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${theme.colors.secondaryWhite};
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryText};
  text-transform: capitalize;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const StatusCell = styled(TableCell)`
  color: ${(props) => props.statusColor || theme.colors.primary};
  font-weight: 600;
`;

const ActionCell = styled(TableCell)`
  text-align: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.secondaryText};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DetailsContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const DetailsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.secondaryPrimary};
    border-radius: 0.5rem;
  }
`;

const DetailsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  flex: 1;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.secondaryText};
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const DetailsContent = styled.div`
  width: 100%;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${theme.colors.bgColor};
  border-radius: 0.625rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItemFull = styled(DetailItem)`
  grid-column: 1 / -1;
`;

const DetailLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryText};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  padding: 0.75rem;
  background-color: ${theme.colors.white};
  border-radius: 0.5rem;
  border: 1px solid ${theme.colors.border};
`;

const StatusValue = styled(DetailValue)`
  color: ${(props) => props.statusColor || theme.colors.primary};
  font-weight: 600;
  border-color: ${(props) => props.statusColor || theme.colors.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #EF4444;
  border: 1px solid #EF4444;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FEE2E2;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default Assets;
