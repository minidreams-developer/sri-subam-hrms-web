import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaUsers } from "react-icons/fa";
import { FiArrowLeft, FiMoreHorizontal, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import AddTeamMemberModal from "../../components/AddTeamMemberModal";
import ReusableTable from "../../components/ReusableTable";
import SearchInputComponent from "../../components/SearchInputComponent";
import { getTeam, getUsers, updateUser } from "../../services/apiServices";
import theme from "../../theme/theme";

const listFrom = (response) => response?.results || response?.data?.results || response?.data || response || [];
const valueOf = (value, keys) => typeof value === "string" ? value : keys.map((key) => value?.[key]).find(Boolean) || "N/A";
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", "-") : "N/A";

const TeamDetails = () => {
  const location = useLocation(); const navigate = useNavigate();
  const teamId = location.state?.teamId; const [team, setTeam] = useState(location.state?.team || null);
  const [members, setMembers] = useState([]); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); const [modalOpen, setModalOpen] = useState(false); const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!teamId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [teamResponse, usersResponse] = await Promise.all([getTeam(teamId), getUsers({ page: 1, limit: 100 })]);
      const detail = teamResponse?.data?.team || teamResponse?.data || teamResponse?.team || teamResponse;
      setTeam(detail);
      const embedded = detail?.members || detail?.teamMembers;
      const users = Array.isArray(embedded) && embedded.length ? embedded : listFrom(usersResponse).filter((user) => {
        const assigned = user?.workInformation?.team || user?.team;
        return String(assigned?.id || assigned?._id || assigned) === String(teamId);
      });
      setMembers(Array.isArray(users) ? users : []);
    } catch (error) { toast.error(error.response?.data?.message || "Failed to load team details"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [teamId]);

  const rows = useMemo(() => members.map((user) => ({
    id: user.id || user._id, employeeId: user.employeeId || user.agentId || "N/A", name: user.name || "N/A",
    designation: valueOf(user.workInformation?.designation || user.designation, ["designationName", "name"]),
    dept: valueOf(user.workInformation?.department || user.department, ["departmentName", "name"]),
    shift: valueOf(user.workInformation?.shift || user.shift, ["shiftName", "name"]),
    joinedDate: formatDate(user.workInformation?.dateOfJoining || user.workInformation?.joinedDate),
    status: user.isActive === false ? "In-Active" : user.status || "Active", actions: "", raw: user,
  })).filter((row) => !search || Object.values(row).some((value) => typeof value !== "object" && String(value).toLowerCase().includes(search.toLowerCase()))), [members, search]);

  const addMember = async ({ employee }) => {
    if (!employee || !teamId) return toast.error("Please select a member");
    setSaving(true);
    try {
      const user = employee.raw || {}; const workInformation = { ...(user.workInformation || {}), team: teamId };
      await updateUser(employee.value, { workInformation, team: teamId });
      toast.success("Member added successfully"); setModalOpen(false); await load();
    } catch (error) { toast.error(error.response?.data?.message || "Failed to add member"); }
    finally { setSaving(false); }
  };
  const removeMember = async (row) => {
    if (!window.confirm(`Remove ${row.name} from this team?`)) return;
    try { await updateUser(row.id, { workInformation: { ...(row.raw.workInformation || {}), team: null }, team: null }); toast.success("Member removed successfully"); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Failed to remove member"); }
  };

  const info = { code: team?.teamCode || team?.teamId || "N/A", name: team?.teamName || team?.name || "N/A", department: valueOf(team?.department, ["departmentName", "name"]), lead: valueOf(team?.teamLead || team?.lead, ["name", "fullName", "email"]) };
  const columns = [{ key:"employeeId",header:"Employee ID"},{ key:"name",header:"Name"},{ key:"designation",header:"Designation"},{ key:"dept",header:"Dept."},{ key:"shift",header:"Shift"},{ key:"joinedDate",header:"Joined Date"},{ key:"status",header:"Status"},{ key:"actions",header:"Action",align:"right"}];

  return <><Back type="button" onClick={() => navigate("/admin/peopleHub/teams")}><FiArrowLeft />Team Details</Back><Card><Toolbar><Heading><Icon><FaUsers /></Icon><h1>Team Name</h1></Heading><Controls><SearchInputComponent placeholder="Search Employee" value={search} onSearchChange={setSearch} width="356px" height="40px"/><AddButton type="button" onClick={() => setModalOpen(true)}><FiPlus />Add New</AddButton><Menu type="button"><FiMoreHorizontal /></Menu></Controls></Toolbar><Summary><Column><Line><Label>Team ID</Label><b>:</b><span>{info.code}</span></Line><Line><Label>Name</Label><b>:</b><span>{info.name}</span></Line><Line><Label>Department</Label><b>:</b><span>{info.department}</span></Line></Column><Column><Line><Label>Team Lead</Label><b>:</b><span>{info.lead}</span></Line><Line><Label>Total Members</Label><b>:</b><span>{rows.length}</span></Line></Column></Summary><ReusableTable columns={columns} data={rows} rowsPerPage={10} totalResults={rows.length} isLoading={loading} onDelete={removeMember} showEditAction={false}/><AddTeamMemberModal isOpen={modalOpen} onClose={() => !saving && setModalOpen(false)} onSave={addMember} isLoading={saving} teamId={teamId}/></Card></>;
};
export default TeamDetails;
const Back=styled.button`margin:0 0 18px;border:0;background:transparent;color:#0c2427;display:flex;align-items:center;gap:14px;font:600 18px "Inter-SemiBold",sans-serif;cursor:pointer;svg{font-size:20px;}`;
const Card=styled.section`min-height:calc(100vh - 175px);padding:20px;background:#fff;border-radius:10px;box-sizing:border-box;`;
const Toolbar=styled.div`display:flex;align-items:center;justify-content:space-between;gap:20px;@media(max-width:900px){align-items:flex-start;flex-direction:column;}`;
const Heading=styled.div`display:flex;align-items:center;gap:18px;h1{margin:0;font:600 18px "Inter-SemiBold",sans-serif;}`;
const Icon=styled.span`width:40px;height:40px;border-radius:6px;background:${theme.colors.secondaryPrimary};color:${theme.colors.primary};display:grid;place-items:center;`;
const Controls=styled.div`display:flex;align-items:center;gap:20px;@media(max-width:650px){width:100%;flex-wrap:wrap;}`;
const AddButton=styled.button`height:40px;min-width:154px;border:0;border-radius:10px;background:${theme.colors.primary};color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:600;cursor:pointer;`;
const Menu=styled.button`width:40px;height:40px;border:1px solid #e0e3e6;border-radius:10px;background:#fff;display:grid;place-items:center;cursor:pointer;`;
const Summary=styled.div`display:grid;grid-template-columns:365px 1fr;gap:78px;margin-top:26px;padding-bottom:26px;border-bottom:1px solid #e0e3e6;@media(max-width:800px){grid-template-columns:1fr;gap:15px;}`;
const Column=styled.div`display:flex;flex-direction:column;gap:15px;`;
const Line=styled.div`display:grid;grid-template-columns:124px 10px 1fr;gap:10px;font:500 16px/1.5 "Inter-Medium",sans-serif;b{font-weight:500;color:#777;}`;
const Label=styled.span`color:#777;`;
