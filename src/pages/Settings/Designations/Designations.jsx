import { useEffect, useState } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { createDesignation, deleteDesignation, getDesignation, getDesignations, updateDesignation } from "../../../services/apiServices";
import { toast } from "react-toastify";

const Designations = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);

  const load = async (nextPage = page, query = search) => {
    setLoading(true);
    try {
      const response = await getDesignations({ page: nextPage, limit: 10, search: query });
      const list = Array.isArray(response) ? response : response?.results || response?.data || [];
      setRows(list.map((item, index) => ({
        id: item.id || item._id,
        no: String((nextPage - 1) * 10 + index + 1).padStart(2, "0"),
        designationName: item.designationName || "N/A",
        designationCode: item.designationCode || "N/A",
        description: item.description || "N/A",
        status: item.isActive === false ? "Inactive" : "Active",
      })));
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      setRows([]);
      toast.error(error.response?.data?.message || "Failed to fetch designations");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(page, search); }, [page, search]);

  const save = async (form) => {
    try {
      if (modal.id) await updateDesignation(modal.id, { designationName: form.designationName, description: form.description });
      else await createDesignation(form);
      toast.success(`Designation ${modal.id ? "updated" : "created"} successfully`);
      setModal(null); setPage(1); load(1, search);
    } catch (error) { toast.error(error.response?.data?.message || "Failed to save designation"); }
  };

  const edit = async (row) => {
    try { const response = await getDesignation(row.id); const item = response?.data || response; setModal({ id: row.id, designationName: item.designationName || row.designationName, designationCode: item.designationCode || row.designationCode, description: item.description || "" }); }
    catch { toast.error("Failed to fetch designation details"); }
  };
  const remove = async (row) => {
    if (!window.confirm(`Deactivate ${row.designationName}?`)) return;
    try { await deleteDesignation(row.id); toast.success("Designation deactivated successfully"); load(page, search); }
    catch (error) { toast.error(error.response?.data?.message || "Failed to deactivate designation"); }
  };

  const columns = [
    { key: "no", label: "No" }, { key: "designationName", label: "Designation" },
    { key: "designationCode", label: "Code" }, { key: "description", label: "Description" },
    { key: "status", label: "Status" }, { key: "actions", label: "Action", useDefaultActionMenu: true },
  ];
  return <Container>
    <TableToolbar searchPosition="left" searchPlaceholder="Search Designation" searchValue={search} onSearchChange={(value) => { setPage(1); setSearch(value); }} showFilter={false} actionText="New Designation" actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />} onActionClick={() => setModal({})} />
    <ReusableTable columns={columns} data={rows} isLoading={loading} server totalPages={totalPages} currentPage={page} onPageChange={setPage} rowsPerPage={10} alwaysShowPagination onEdit={edit} onDelete={remove} />
    {modal && <DesignationModal initial={modal} onClose={() => setModal(null)} onSave={save} />}
  </Container>;
};

const DesignationModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({ designationName: initial.designationName || "", designationCode: initial.designationCode || "", description: initial.description || "" });
  const submit = (event) => { event.preventDefault(); if (!form.designationName.trim() || (!initial.id && !form.designationCode.trim())) return toast.error("Designation name and code are required"); onSave(form); };
  return <Overlay onClick={onClose}><Modal onClick={(event) => event.stopPropagation()}><h2>{initial.id ? "Edit Designation" : "Add New Designation"}</h2><form onSubmit={submit}><label>Designation Name<input value={form.designationName} onChange={(e) => setForm({ ...form, designationName: e.target.value })} /></label>{!initial.id && <label>Designation Code<input value={form.designationCode} onChange={(e) => setForm({ ...form, designationCode: e.target.value })} /></label>}<label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><Actions><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save</button></Actions></form></Modal></Overlay>;
};

const Container = styled.div`width:100%; padding:1rem 0;`;
const Overlay = styled.div`position:fixed; inset:0; z-index:1000; display:grid; place-items:center; background:rgba(15,23,42,.45);`;
const Modal = styled.div`width:min(30rem, calc(100vw - 2rem)); background:#fff; border-radius:12px; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,.2); h2{margin:0 0 20px;} label{display:grid; gap:7px; margin:14px 0; font-weight:600; color:#334155;} input,textarea{width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #d1d5db; border-radius:6px; font:inherit;} textarea{min-height:90px; resize:vertical;}`;
const Actions = styled.div`display:flex; justify-content:flex-end; gap:10px; margin-top:20px; button{border:0; border-radius:6px; padding:10px 18px; cursor:pointer;} button:last-child{background:#006a9d; color:#fff;}`;
export default Designations;
