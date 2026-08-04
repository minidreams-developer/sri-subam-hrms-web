import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiEdit3, FiList } from "react-icons/fi";
import { IoAdd, IoClose } from "react-icons/io5";

const initialAssets = [
  {
    id: 1,
    assetName: "Laptop",
    serialId: "SIN-123-456-596",
    issueDate: "14-01-2026",
    assetCondition: "Used",
    status: "Currently Using",
    returnDate: "14-01-2026",
    returnCondition: "Good",
    remarks: "-",
  },
  {
    id: 2,
    assetName: "Headphones",
    serialId: "KIL-123-456",
    issueDate: "14-01-2026",
    assetCondition: "New",
    status: "Returned",
    returnDate: "14-01-2026",
    returnCondition: "Good",
    remarks: "-",
  },
  {
    id: 3,
    assetName: "ID Card",
    serialId: "ID5866",
    issueDate: "14-01-2026",
    assetCondition: "New",
    status: "Not Returned",
    returnDate: "-",
    returnCondition: "-",
    remarks: "-",
  },
];

const Assets = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (!selectedAsset) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedAsset(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedAsset]);

  return (
    <>
      <Container>
        <Header>
          <Title><TitleIcon><FiList /></TitleIcon>Assets List</Title>
          <AddButton type="button"><IoAdd size={18} />New Assets</AddButton>
        </Header>
        <Table>
          <thead>
            <tr>
              <th>Asset Name</th><th>Serial / Asset ID</th><th>Issue Date</th>
              <th>Asset Condition</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {initialAssets.map((asset) => (
              <tr key={asset.id} onClick={() => setSelectedAsset(asset)}>
                <td>{asset.assetName}</td><td>{asset.serialId}</td><td>{asset.issueDate}</td>
                <td>{asset.assetCondition}</td><StatusCell>{asset.status}</StatusCell>
                <ActionCell onClick={(event) => event.stopPropagation()}>•••</ActionCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Overlay $open={Boolean(selectedAsset)} onClick={() => setSelectedAsset(null)} />
      <Drawer $open={Boolean(selectedAsset)} role="dialog" aria-modal="true" aria-label="Assets Details">
        <DrawerHeader>
          <DrawerTitle>Assets Details</DrawerTitle>
          <CloseButton type="button" aria-label="Close assets details" onClick={() => setSelectedAsset(null)}>
            <IoClose />
          </CloseButton>
        </DrawerHeader>
        {selectedAsset && (
          <DrawerBody>
            <SectionTitle><span>Employee Details</span><EditButton type="button" aria-label="Edit employee asset details"><FiEdit3 /></EditButton></SectionTitle>
            <DetailsCard>
              <Detail><Label>Asset Name</Label><Value>{selectedAsset.assetName}</Value></Detail>
              <Detail><Label>Serial / Asset ID</Label><Value>{selectedAsset.serialId}</Value></Detail>
              <Detail><Label>Issue Date</Label><Value>{selectedAsset.issueDate}</Value></Detail>
              <Detail><Label>Asset Condition</Label><Value>{selectedAsset.assetCondition}</Value></Detail>
              <Detail><Label>Status</Label><StatusValue>{selectedAsset.status}</StatusValue></Detail>
            </DetailsCard>

            <SectionTitle $return><span>Return Details</span><EditButton type="button" aria-label="Edit return details"><FiEdit3 /></EditButton></SectionTitle>
            <DetailsCard $return>
              <Detail><Label>Return Date</Label><Value>{selectedAsset.returnDate}</Value></Detail>
              <Detail><Label>Return Condition</Label><Value>{selectedAsset.returnCondition}</Value></Detail>
              <Detail><Label>Remarks</Label><Value>{selectedAsset.remarks}</Value></Detail>
            </DetailsCard>
          </DrawerBody>
        )}
      </Drawer>
    </>
  );
};

export default Assets;

const Container = styled.section`
  width: 100%; background: #fff; border: 1px solid #e3e7e9; border-radius: 10px;
  padding: 22px; color: #10282c;
`;
const Header = styled.div`display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;`;
const Title = styled.h2`display:flex; align-items:center; gap:12px; margin:0; font:600 18px "Inter-SemiBold",sans-serif;`;
const TitleIcon = styled.span`width:44px;height:44px;border-radius:8px;background:#f1f7f7;color:#006d78;display:grid;place-items:center;font-size:22px;`;
const AddButton = styled.button`display:flex;align-items:center;gap:7px;border:0;border-radius:7px;background:#066c78;color:#fff;padding:10px 14px;font:600 13px "Inter-SemiBold",sans-serif;cursor:pointer;`;
const Table = styled.table`
  width:100%;border-collapse:collapse;font-size:14px;
  th,td{padding:16px 12px;text-align:left;border-top:1px solid #e7eaec;}
  th{color:#697477;font-family:"Inter-Medium",sans-serif;font-weight:500;}
  td{font-family:"Inter-Medium",sans-serif;font-weight:500;}
  tbody tr{cursor:pointer;} tbody tr:hover{background:#f7fafa;}
`;
const StatusCell = styled.td`color:#006f7a;`;
const ActionCell = styled.td`letter-spacing:2px;`;
const Overlay = styled.div`
  position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.67);opacity:${({$open})=>$open?1:0};
  visibility:${({$open})=>$open?"visible":"hidden"};transition:opacity .2s ease,visibility .2s ease;
`;
const Drawer = styled.aside`
  position:fixed;z-index:1101;top:0;right:0;width:656px;max-width:100vw;height:100dvh;background:#fff;
  transform:translateX(${({$open})=>$open?"0":"100%"});transition:transform .25s ease;box-shadow:-4px 0 18px rgba(0,0,0,.08);
  font-family:"Inter-Regular","Inter",sans-serif;color:#10282c;
`;
const DrawerHeader = styled.div`height:83px;padding:0 23px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfe4e6;`;
const DrawerTitle = styled.h2`
  margin:0;font:600 24px "Inter-SemiBold",sans-serif;letter-spacing:-.4px;
  @media (max-width:650px){font-size:21px;}
`;
const CloseButton = styled.button`border:0;background:transparent;color:#8297b8;font-size:29px;line-height:1;padding:4px;display:flex;cursor:pointer;`;
const DrawerBody = styled.div`padding:26px 23px;overflow-y:auto;height:calc(100dvh - 83px);`;
const SectionTitle = styled.div`
  display:flex;align-items:center;justify-content:space-between;color:#007382;font:600 18px "Inter-SemiBold",sans-serif;
  margin-bottom:15px;margin-top:${({$return})=>$return?"27px":"0"};
`;
const EditButton = styled.button`border:0;background:transparent;color:#007382;font-size:26px;padding:0;display:flex;cursor:pointer;`;
const DetailsCard = styled.div`
  min-height:${({$return})=>$return?"162px":"248px"};border:1px solid #d8dfe2;border-radius:11px;background:#f7fafc;
  padding:18px 22px;display:grid;grid-template-columns:1fr 1fr;column-gap:58px;row-gap:29px;
  ${({$return})=>$return&&"row-gap:28px;"}
  @media (max-width:650px){column-gap:20px;padding:18px;}
`;
const Detail = styled.div`display:flex;flex-direction:column;gap:6px;align-self:start;`;
const Label = styled.span`color:#73787a;font:400 16px "Inter-Regular",sans-serif;`;
const Value = styled.span`color:#10282c;font:400 18px "Inter-Regular",sans-serif;`;
const StatusValue = styled(Value)`color:#007382;`;
