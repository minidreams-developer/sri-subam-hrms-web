import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaUsers } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import AddTeamModal from "../../components/AddTeamModal";
import ReusableTable from "../../components/ReusableTable";
import SearchInputComponent from "../../components/SearchInputComponent";
import { del, get, post } from "../../helpers/api_helper";
import { CREATE_TEAM, TEAMS } from "../../helpers/url_helper";
import theme from "../../theme/theme";

const listFrom = (response) => response?.results || response?.data?.results || response?.data || response || [];
const textOf = (value, keys = ["name"]) => {
  if (!value) return "N/A";
  if (typeof value === "string") return value;
  for (const key of keys) if (value[key]) return value[key];
  return "N/A";
};

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const response = await get(`${TEAMS}?page=1&limit=100`);
      const list = listFrom(response);
      setTeams(Array.isArray(list) ? list : []);
    } catch (error) { toast.error(error.response?.data?.message || "Failed to load teams"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTeams(); }, []);

  const rows = useMemo(() => teams.map((team) => ({
    id: team.id || team._id, raw: team,
    teamId: team.teamCode || team.teamId || "N/A",
    name: team.teamName || team.name || "N/A",
    department: textOf(team.department, ["departmentName", "name"]),
    teamLead: textOf(team.teamLead || team.lead, ["name", "fullName", "email"]),
    totalMembers: team.totalMembers ?? team.memberCount ?? team.members?.length ?? 0,
    actions: "",
  })).filter((team) => !search.trim() || Object.values(team).some((value) => typeof value !== "object" && String(value).toLowerCase().includes(search.toLowerCase()))), [teams, search]);

  const createTeam = async (form) => {
    setSaving(true);
    try {
      await post(CREATE_TEAM, { teamCode: form.teamId, teamId: form.teamId, teamName: form.name.trim(), name: form.name.trim(), department: form.department.value, teamLead: form.teamLead.value });
      toast.success("Team created successfully"); setModalOpen(false); await loadTeams();
    } catch (error) { toast.error(error.response?.data?.message || "Failed to create team"); }
    finally { setSaving(false); }
  };
  const openTeam = (row) => navigate("/admin/peopleHub/teams/teamDetails", { state: { teamId: row.id, team: row.raw } });
  const removeTeam = async (row) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    try { await del(`${TEAMS}/${row.id}`); toast.success("Team deleted successfully"); await loadTeams(); }
    catch (error) { toast.error(error.response?.data?.message || "Failed to delete team"); }
  };
  const columns = [
    { key: "teamId", header: "Team ID" }, { key: "name", header: "Name" }, { key: "department", header: "Department" },
    { key: "teamLead", header: "Team Lead" }, { key: "totalMembers", header: "Total Members" }, { key: "actions", header: "Action", align: "right" },
  ];

  return <Card><Toolbar><Heading><Icon><FaUsers /></Icon><h1>All Teams</h1></Heading><Controls><SearchInputComponent placeholder="Search Teams" value={search} onSearchChange={setSearch} width="356px" height="40px" /><AddButton type="button" onClick={() => setModalOpen(true)}><FiPlus />Add Team</AddButton></Controls></Toolbar><TableWrap><ReusableTable columns={columns} data={rows} rowsPerPage={10} totalResults={rows.length} isLoading={loading} onRowClick={openTeam} onView={openTeam} onDelete={removeTeam} showEditAction={false} /></TableWrap><AddTeamModal isOpen={modalOpen} onClose={() => !saving && setModalOpen(false)} onSave={createTeam} isLoading={saving} /></Card>;
};

export default Teams;
const Card = styled.section`min-height:calc(100vh - 130px);padding:20px;background:#fff;border-radius:10px;box-sizing:border-box;`;
const Toolbar = styled.div`display:flex;align-items:center;justify-content:space-between;gap:24px;padding-bottom:23px;border-bottom:1px solid #e0e3e6;@media(max-width:850px){align-items:flex-start;flex-direction:column;}`;
const Heading = styled.div`display:flex;align-items:center;gap:18px;h1{margin:0;color:${theme.colors.textColor};font:600 18px "Inter-SemiBold",sans-serif;}`;
const Icon = styled.span`width:40px;height:40px;border-radius:6px;background:${theme.colors.secondaryPrimary};color:${theme.colors.primary};display:grid;place-items:center;svg{width:19px;height:19px;}`;
const Controls = styled.div`display:flex;align-items:center;gap:20px;@media(max-width:600px){width:100%;flex-wrap:wrap;}`;
const AddButton = styled.button`height:40px;min-width:154px;padding:0 20px;border:0;border-radius:10px;background:${theme.colors.primary};color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font:600 14px "Inter-SemiBold",sans-serif;cursor:pointer;svg{font-size:20px;}`;
const TableWrap = styled.div`th{padding-top:13px;padding-bottom:13px;}td{padding-top:14px;padding-bottom:14px;}`;
