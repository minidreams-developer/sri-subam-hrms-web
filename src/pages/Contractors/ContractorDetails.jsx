import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getContractor } from "../../services/apiServices";
import { toast } from "react-toastify";
import {
  FiChevronDown, FiChevronLeft, FiChevronRight, FiDownload,
  FiEdit2, FiFileText, FiImage, FiPaperclip, FiPlus, FiPrinter,
  FiRefreshCw, FiSave, FiTrash2, FiX, FiCheck,
} from "react-icons/fi";

const hqJobs = [
  { name: "AC Installation", unit: "Piece", price: "$120.00" },
  { name: "Duct Cleaning", unit: "Sq. Ft.", price: "$2.50" },
];
const northJobs = [{ name: "Routine Maintenance", unit: "Hour", price: "$45.00" }];
const requests = {
  hq: [{ date: "22/Apr/2026", day: "Wednesday", job: "AC Installation", quantity: "2 Piece", price: "$120.00", total: "$240.00", remarks: "Server Room 2" }],
  north: [{ date: "23/Apr/2026", day: "Thursday", job: "Routine Maintenance", quantity: "5 Hour", price: "$45.00", total: "$225.00", remarks: "Lobby HVAC Check" }],
};
const logs = {
  hq: [
    { date: "10/Apr/2026", job: "AC Installation", qty: "2", unit: "Piece", price: "$120.00", remarks: "Building A, Fl 3", file: "paperclip" },
    { date: "12/Apr/2026", job: "Duct Cleaning", qty: "500", unit: "Sq. Ft.", price: "$2.50", remarks: "Main Hallway", file: "image" },
  ],
  north: [
    { date: "15/Apr/2026", job: "Routine Maintenance", qty: "10", unit: "Hour", price: "$45.00", remarks: "Monthly checkup" },
    { date: "20/Apr/2026", job: "AC Installation", qty: "1", unit: "Piece", price: "$120.00", remarks: "Server Room" },
  ],
};

const ContractorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [requestRows, setRequestRows] = useState(requests);
  const [logRows, setLogRows] = useState(logs);
  const [jobRows, setJobRows] = useState({ hq: hqJobs, north: northJobs });
  const [reportFilters, setReportFilters] = useState({ branch: "All Branches", type: "Custom", from: "2026-04-01", to: "2026-04-30" });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContractor(id);
        setContractor(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load contractor details");
      } finally { setLoading(false); }
    };
    if (id) load(); else setLoading(false);
  }, [id]);

  if (loading) return <State><Spinner />Loading contractor details...</State>;

  const raw = contractor || {};
  const work = raw.workInformation || {};
  const name = raw.name || "Manoj";
  const contractorId = raw.contractorId || raw.employeeId || "CON-10024";
  const specialty = work.specialty || "HVAC";
  const company = raw.companyName || work.companyName || "itboomi";
  const gst = raw.gstNumber || work.gstNumber || "29ABCDE1234F1Z5";
  const license = raw.licenseNumber || work.licenseNumber || "LIC-99082-TN";

  const print = (section) => navigate(`/admin/contractors/${id}/print`, { state: { section } });
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(2026, 3 + monthOffset, 1));
  const removeJob = (region, index) => {
    if (!window.confirm("Delete this job item?")) return;
    setJobRows((current) => ({ ...current, [region]: current[region].filter((_, i) => i !== index) }));
    toast.success("Job item deleted");
  };
  const decideRequest = (region, index, decision) => {
    setRequestRows((current) => ({ ...current, [region]: current[region].filter((_, i) => i !== index) }));
    toast.success(`Request ${decision}`);
  };
  const removeLog = (region, index) => {
    if (!window.confirm("Delete this work log?")) return;
    setLogRows((current) => ({ ...current, [region]: current[region].filter((_, i) => i !== index) }));
    toast.success("Work log deleted");
  };
  const openReport = () => navigate(`/admin/contractors/${id}/report`, { state: { filters: reportFilters } });

  return (
    <Page>
      <Breadcrumb><span onClick={() => navigate("/admin/contractors/contractors")}>Contractors</span><b>›</b><strong>Details</strong></Breadcrumb>

      <Card>
        <CardHeading>
          <Title>Contractor Information</Title>
          <Actions><SoftButton onClick={() => print("all")}><FiDownload />Download Profile</SoftButton><OutlineButton onClick={() => navigate("/admin/contractors/add", { state: { contractor: raw, contractorId: id, mode: "edit" } })}><FiEdit2 />Edit Details</OutlineButton></Actions>
        </CardHeading>
        <Profile>
          <Avatar aria-label="Contractor photo">{name.charAt(0)}</Avatar>
          <DetailsGrid>
            <Detail label="Contractor ID" value={contractorId} />
            <Detail label="Contractor Name" value={name} />
            <Detail label="Specialty" value={<Badge>{specialty}</Badge>} />
            <Detail label="Company Name" value={company} />
            <Detail label="GST Number" value={gst} />
            <Detail label="License No" value={license} />
          </DetailsGrid>
        </Profile>
      </Card>

      <JobTable title="Assigned Job Items - Headquarters" rows={jobRows.hq} expanded={expanded} setExpanded={setExpanded} onPrint={() => print("hq")} onRefresh={() => toast.info("Job item update opened")} onDelete={(i) => removeJob("hq", i)} />
      <JobTable title="Assigned Job Items - North Region" rows={jobRows.north} expanded={-1} setExpanded={() => {}} onPrint={() => print("north")} onRefresh={() => toast.info("Job item update opened")} onDelete={(i) => removeJob("north", i)} />

      <MonthBar><SquareButton onClick={() => setMonthOffset((m) => m - 1)}><FiChevronLeft /></SquareButton><Month>{monthLabel}</Month><SquareButton onClick={() => setMonthOffset((m) => m + 1)}><FiChevronRight /></SquareButton><MonthActions><BlueButton onClick={() => setReportOpen(true)}><FiFileText />Reports</BlueButton><OutlineBlue onClick={() => navigate("/admin/contractors/add-work-entry", { state: { contractorId: id, contractor: raw } })}><FiPlus />Log Work</OutlineBlue></MonthActions></MonthBar>

      <RequestTable title="Requests - Headquarters" rows={requestRows.hq} onDecision={(i, d) => decideRequest("hq", i, d)} />
      <RequestTable title="Requests - North Region" rows={requestRows.north} onDecision={(i, d) => decideRequest("north", i, d)} />

      <Stats>
        <Stat $color="#08af67"><small>Total Earned</small><b>${raw.totalEarned || "1,450.00"}</b></Stat>
        <Stat $color="#066C78"><small>Pay Out</small><b>${raw.payOut || "1,000.00"}</b></Stat>
        <Stat $color="#ef3d45"><small>Outstanding</small><b>${raw.outstanding || "450.00"}</b></Stat>
      </Stats>

      <LogTable title="Day-wise Work Log - Headquarters" rows={logRows.hq} onDelete={(i) => removeLog("hq", i)} />
      <LogTable title="Day-wise Work Log - North Region" rows={logRows.north} onDelete={(i) => removeLog("north", i)} />

      <Footer><OutlineButton onClick={() => navigate(-1)}>Close</OutlineButton><BlueButton onClick={() => toast.success("Work saved successfully")}><FiSave />Save Work</BlueButton></Footer>
      {reportOpen && <ModalOverlay onMouseDown={() => setReportOpen(false)}><ReportModal onMouseDown={(e) => e.stopPropagation()}>
        <ModalTitle>Generate Report</ModalTitle>
        <Field><label>Branch</label><select value={reportFilters.branch} onChange={(e) => setReportFilters({ ...reportFilters, branch: e.target.value })}><option>All Branches</option><option>Headquarters</option><option>North Region</option></select></Field>
        <Field><label>Report Type</label><select value={reportFilters.type} onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })}><option>Custom</option><option>Summary</option><option>Detailed</option></select></Field>
        <DateFields><Field><label>From Date</label><input type="date" value={reportFilters.from} onChange={(e) => setReportFilters({ ...reportFilters, from: e.target.value })} /></Field><Field><label>To Date</label><input type="date" value={reportFilters.to} onChange={(e) => setReportFilters({ ...reportFilters, to: e.target.value })} /></Field></DateFields>
        <ModalFooter><OutlineButton onClick={() => setReportOpen(false)}><FiX />Close</OutlineButton><BlueButton onClick={openReport}>View Report <FiChevronRight /></BlueButton></ModalFooter>
      </ReportModal></ModalOverlay>}
    </Page>
  );
};

const Detail = ({ label, value }) => <Info><span>{label}</span><strong>{value}</strong></Info>;

const PrintAction = ({ onClick }) => <PrintWrap><button onClick={onClick}>Print</button><BlueIcon onClick={onClick}><FiPrinter /></BlueIcon></PrintWrap>;

const JobTable = ({ title, rows, expanded, setExpanded, onPrint, onRefresh, onDelete }) => (
  <Card>
    <SimpleHeading><Title>{title}</Title><PrintAction onClick={onPrint} /></SimpleHeading>
    <TableShell><table><thead><tr><th>S.No</th><th>Job Items</th><th>Unit</th><th>Price/Unit</th><th>Action</th></tr></thead>
      <tbody>{rows.map((row, i) => <React.Fragment key={row.name}><tr><td>{i + 1}</td><td>{row.name}</td><td>{row.unit}</td><td>{row.price}</td><td><RowActions><FiRefreshCw onClick={() => onRefresh(i)} /><FiTrash2 onClick={() => onDelete(i)} /><FiChevronDown onClick={() => setExpanded(expanded === i ? -1 : i)} /></RowActions></td></tr>
        {expanded === i && <tr className="expanded"><td colSpan="5"><UpdateGrid><Detail label="Previous Update" value="10/Jan/2026" /><Detail label="Job item" value={row.name} /><Detail label="Unit" value={row.unit} /><Detail label="Price/Unit" value="$110.00" /><Detail label="Updated" value="15/Feb/2026" /><Detail label="Updated By" value="Admin User" /></UpdateGrid></td></tr>}</React.Fragment>)}</tbody></table></TableShell>
  </Card>
);

const RequestTable = ({ title, rows, onDecision }) => (
  <Card><SimpleHeading><Title>{title}</Title><Select>All <FiChevronDown /></Select></SimpleHeading>
    <TableShell><table><thead><tr><th>S.No</th><th>Date</th><th>Day</th><th>Job Item</th><th>Qty/Unit</th><th>Price/Unit</th><th>Total</th><th>Remarks</th><th>Actions</th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={r.date}><td>{i + 1}</td><td>{r.date}</td><td>{r.day}</td><td>{r.job}</td><td>{r.quantity}</td><td>{r.price}</td><td>{r.total}</td><td className="muted">{r.remarks}</td><td><Decision><i onClick={() => onDecision(i, "approved")}><FiCheck /></i><b onClick={() => onDecision(i, "rejected")}><FiX /></b></Decision></td></tr>)}</tbody></table></TableShell>
  </Card>
);

const LogTable = ({ title, rows, onDelete }) => (
  <Card><SimpleHeading><Title>{title}</Title></SimpleHeading>
    <TableShell><table><thead><tr><th>S.No</th><th>Date</th><th>Job Item</th><th>Qty</th><th>Unit</th><th>Price/Unit</th><th>Remarks</th><th>File</th><th>Action</th></tr></thead>
      <tbody>{rows.map((r, i) => <tr key={r.date}><td>{i + 1}</td><td>{r.date}</td><td>{r.job}</td><td>{r.qty}</td><td>{r.unit}</td><td>{r.price}</td><td className="muted">{r.remarks}</td><td className="file" onClick={() => r.file && toast.info("Opening attachment")}>{r.file === "paperclip" ? <FiPaperclip /> : r.file === "image" ? <FiImage /> : "-"}</td><td><Delete onClick={() => onDelete(i)}><FiTrash2 /></Delete></td></tr>)}</tbody></table></TableShell>
  </Card>
);

const Page = styled.main`background:#f4f6fa; min-height:100vh; padding:24px 32px 0; color:#111827; font:14px Inter, sans-serif; @media(max-width:900px){padding:16px;}`;
const Breadcrumb = styled.div`height:42px; display:flex; align-items:flex-start; gap:8px; color:#737373; font-size:16px; span{cursor:pointer} strong{color:#111827}`;
const Card = styled.section`background:#fff; border:1px solid #e1e5eb; border-radius:12px; padding:24px; margin-bottom:24px; box-shadow:0 1px 2px rgba(16,24,40,.02);`;
const CardHeading = styled.div`display:flex; justify-content:space-between; align-items:center; padding-bottom:16px; border-bottom:1px solid #e5e7eb; @media(max-width:900px){align-items:flex-start;flex-direction:column;gap:16px;}`;
const SimpleHeading = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;`;
const Title = styled.h2`font-size:16px; line-height:22px; font-weight:700; margin:0;`;
const Actions = styled.div`display:flex; gap:12px;`;
const buttonBase = `height:40px; border-radius:7px; padding:0 20px; display:inline-flex; align-items:center; justify-content:center; gap:9px; font:500 14px Inter,sans-serif; cursor:pointer;`;
const OutlineButton = styled.button`${buttonBase} background:#fff; border:1px solid #cfd5de; color:#111827;`;
const SoftButton = styled.button`${buttonBase} background:#fff0f1; border:0; color:#ff3e46;`;
const BlueButton = styled.button`${buttonBase} background:#066C78; border:1px solid #066C78; color:#fff;`;
const OutlineBlue = styled.button`${buttonBase} background:#fff; border:1px solid #066C78; color:#066C78;`;
const Profile = styled.div`display:flex; gap:32px; padding-top:24px; align-items:center; @media(max-width:900px){align-items:flex-start;flex-direction:column;}`;
const Avatar = styled.div`width:120px; height:120px; flex:0 0 120px; border-radius:12px; background:linear-gradient(145deg,#bed3c6,#78998b); display:grid; place-items:center; color:white; font-size:42px; font-weight:700;`;
const DetailsGrid = styled.div`display:grid; grid-template-columns:repeat(3,minmax(150px,1fr)); gap:26px 48px; flex:1; width:100%; @media(max-width:900px){grid-template-columns:repeat(2,1fr);}`;
const Info = styled.div`display:flex; flex-direction:column; gap:5px; min-width:0; span{color:#737373;font-size:12px} strong{font-size:14px;font-weight:600;color:#111827}`;
const Badge = styled.em`font-style:normal; font-size:11px; padding:4px 11px; border-radius:14px; color:#7c35dc; background:#f0ddff;`;
const PrintWrap = styled.div`display:flex;align-items:center;gap:10px;button{border:0;background:none;color:#066C78;font-weight:600;cursor:pointer}`;
const BlueIcon = styled.button`width:32px;height:32px;padding:0;border:0;border-radius:6px;background:#066C78;color:#fff;display:grid;place-items:center;cursor:pointer;`;
const TableShell = styled.div`border:1px solid #dfe3e8; border-radius:8px; overflow-x:auto; table{width:100%;border-collapse:collapse;min-width:740px} th{height:41px;background:#eef1f3;color:#6b6f75;font-size:12px;font-weight:500;text-align:left;padding:0 16px;white-space:nowrap} td{height:60px;padding:0 16px;border-top:1px solid #e7e9ed;font-size:13px;white-space:nowrap}.muted{color:#858585}.file{color:#1769e0;font-size:18px}.expanded td{height:auto;background:#f8f9fb;padding:16px 24px}`;
const RowActions = styled.div`display:flex;align-items:center;justify-content:center;gap:20px;color:#ff4b37;svg{cursor:pointer}svg:last-child{color:#6b7280}`;
const UpdateGrid = styled.div`display:grid;grid-template-columns:repeat(6,1fr);gap:16px;`;
const MonthBar = styled.section`position:relative;background:#fff;border:1px solid #e1e5eb;border-radius:12px;min-height:72px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:36px; @media(max-width:900px){justify-content:flex-start;padding:16px;flex-wrap:wrap;}`;
const Month = styled.strong`font-size:17px;`;
const SquareButton = styled.button`width:32px;height:32px;border:1px solid #d2d8df;background:#fff;border-radius:6px;display:grid;place-items:center;color:#69707a;cursor:pointer;`;
const MonthActions = styled.div`position:absolute;right:24px;display:flex;gap:12px; @media(max-width:900px){position:static;margin-left:auto;}`;
const Select = styled.button`height:32px;width:120px;padding:0 12px;border:1px solid #d2d8df;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:space-between;`;
const Decision = styled.div`display:flex;gap:8px;i,b{width:32px;height:32px;border-radius:6px;display:grid;place-items:center;color:#fff;cursor:pointer}i{background:#08b56d}b{background:#f2434b}`;
const Delete = styled.button`width:32px;height:32px;border:0;border-radius:6px;background:#f2434b;color:#fff;display:grid;place-items:center;cursor:pointer;`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:0 0 24px; @media(max-width:900px){grid-template-columns:1fr;}`;
const Stat = styled.div`position:relative;background:#fff;border:1px solid #e1e5eb;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:8px;overflow:hidden;&:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:${p=>p.$color}}small{color:#737373;font-size:13px}b{font-size:26px}`;
const Footer = styled.footer`height:82px;margin:48px -16px 0;padding:0 24px;background:#fff;border-top:1px solid #e4e7eb;display:flex;align-items:center;justify-content:space-between;`;
const State = styled.div`height:70vh;display:flex;align-items:center;justify-content:center;gap:12px;color:#64748b;`;
const Spinner = styled.div`width:24px;height:24px;border:3px solid #dbe3ee;border-top-color:#066C78;border-radius:50%;animation:spin .8s linear infinite;@keyframes spin{to{transform:rotate(360deg)}}`;
const ModalOverlay = styled.div`position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;display:grid;place-items:center;padding:20px;`;
const ReportModal = styled.div`width:min(420px,100%);background:#fff;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.3);padding:28px 24px 0;`;
const ModalTitle = styled.h2`font-size:19px;margin:0 0 20px;`;
const Field = styled.div`display:flex;flex-direction:column;gap:8px;margin-bottom:16px;label{font-weight:600}select,input{height:40px;border:1px solid #ccd3dc;border-radius:6px;background:#fff;padding:0 12px;color:#1f2937;font:14px Inter,sans-serif;outline:none}select:focus,input:focus{border-color:#066C78}`;
const DateFields = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;`;
const ModalFooter = styled.div`margin:8px -24px 0;padding:16px 24px;border-top:1px solid #e2e5e9;background:#fafbfc;border-radius:0 0 12px 12px;display:flex;justify-content:space-between;`;

export default ContractorDetails;
