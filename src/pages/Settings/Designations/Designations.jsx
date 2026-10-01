import { useEffect, useState } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { createDesignation, generateDesignationId, getDesignation, getDesignations, updateDesignation } from "../../../services/apiServices";
import { toast } from "react-toastify";
import InputComponent from "../../../components/InputComponent";
import Button from "../../../components/Button";

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
        isActive: item.isActive !== false,
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
  const toggleStatus = async (row) => {
    try {
      await updateDesignation(row.id, { isActive: !row.isActive });
      toast.success(`Designation ${row.isActive ? "deactivated" : "activated"} successfully`);
      load(page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update designation status");
    }
  };

  const columns = [
    { key: "no", label: "No" }, { key: "designationName", label: "Designation" },
    { key: "designationCode", label: "Code" }, { key: "description", label: "Description" },
    { key: "status", label: "Status", render: (row) => <Status $active={row.isActive}>{row.status}</Status> },
    { key: "actions", label: "Action", render: (row) => <ActionButton type="button" $active={row.isActive} onClick={(event) => { event.stopPropagation(); toggleStatus(row); }}>{row.isActive ? "Deactivate" : "Activate"}</ActionButton> },
  ];
  return <Container>
    <TableToolbar searchPosition="left" searchPlaceholder="Search Designation" searchValue={search} onSearchChange={(value) => { setPage(1); setSearch(value); }} showFilter={false} actionText="New Designation" actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />} onActionClick={() => setModal({})} />
    <ReusableTable columns={columns} data={rows} isLoading={loading} server totalPages={totalPages} currentPage={page} onPageChange={setPage} rowsPerPage={10} alwaysShowPagination onEdit={edit} />
    {modal && <DesignationModal initial={modal} onClose={() => setModal(null)} onSave={save} />}
  </Container>;
};

const DesignationModal = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState({ designationName: initial.designationName || "", designationCode: initial.designationCode || "", description: initial.description || "" });
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    if (initial.id || form.designationCode) return;
    const generateCode = async () => {
      setGeneratingCode(true);
      try {
        const response = await generateDesignationId();
        const code = response?.designationCode || response?.code || response?.data?.designationCode || response?.data?.code;
        if (code) setForm((current) => ({ ...current, designationCode: code }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to generate designation code");
      } finally { setGeneratingCode(false); }
    };
    generateCode();
  }, [initial.id]);

  const submit = (event) => { event.preventDefault(); if (!form.designationName.trim() || (!initial.id && !form.designationCode.trim())) return toast.error("Designation name and code are required"); onSave(form); };
  return <Overlay onClick={onClose}><Modal onClick={(event) => event.stopPropagation()}><h2>{initial.id ? "Edit Designation" : "Add New Designation"}</h2><form onSubmit={submit}>
    <InputComponent label="Designation Name" placeholder="Enter designation name" value={form.designationName} onChange={(e) => setForm({ ...form, designationName: e.target.value })} />
    {!initial.id && <InputComponent label="Designation Code" placeholder={generatingCode ? "Generating code..." : "Enter designation code"} value={form.designationCode} onChange={(e) => setForm({ ...form, designationCode: e.target.value })} disabled={generatingCode} />}
    <Field><FieldLabel>Description</FieldLabel><Description value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" /></Field>
    <Actions><Button type="button" text="Cancel" bg="#F1F1F1" color="#111827" onClick={onClose} /><Button type="submit" text="Save" /></Actions>
  </form></Modal></Overlay>;
};

const Container = styled.div`width:100%; padding:1rem 0;`;
const Overlay = styled.div`position:fixed; inset:0; z-index:1000; display:grid; place-items:center; background:rgba(15,23,42,.45);`;
const Modal = styled.div`width:min(30rem, calc(100vw - 2rem)); background:#fff; border-radius:12px; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,.2); h2{margin:0 0 20px;}`;
const Field = styled.div`margin-top:1rem;`;
const FieldLabel = styled.label`display:block; margin-bottom:.625rem; font-size:.875rem; font-weight:500; color:#0c0c0c;`;
const Description = styled.textarea`width:100%; min-height:90px; box-sizing:border-box; padding:.75rem 1rem; border:1px solid #e7e7e7; border-radius:.625rem; resize:vertical; font:400 .875rem Inter,sans-serif; outline:none; &:focus{border:2px solid #066c78;}`;
const Actions = styled.div`display:flex; justify-content:flex-end; gap:10px; margin-top:20px;`;
const Status = styled.span`color:${({ $active }) => $active ? "#16805c" : "#b42318"}; font-weight:600;`;
const ActionButton = styled.button`border:0; border-radius:6px; padding:8px 12px; cursor:pointer; color:#fff; background:${({ $active }) => $active ? "#b42318" : "#16805c"};`;
export default Designations;
