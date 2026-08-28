import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiEdit3, FiList } from "react-icons/fi";
import { IoAdd, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { assignAsset, createAsset, getEmployeeAssets, updateAsset } from "../services/apiServices";

const blank = { assetName:"", assetSerialNumber:"", assetType:"issued", assetDescription:"", assetContition:"new", assetStatus:"currently_using", issuedDate:"" };
const label = (v) => v ? String(v).replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()) : "-";
const dateLabel = (v) => { if(!v) return "-"; const d=new Date(v); return Number.isNaN(d.getTime())?v:d.toLocaleDateString("en-GB"); };

export default function Assets({ employee }) {
  const employeeId=employee?._id||employee?.id;
  const [assets,setAssets]=useState([]), [loading,setLoading]=useState(false), [saving,setSaving]=useState(false);
  const [mode,setMode]=useState(null), [selected,setSelected]=useState(null), [form,setForm]=useState(blank), [reload,setReload]=useState(0);

  useEffect(()=>{ if(!employeeId){setAssets([]);return;} let live=true;
    (async()=>{setLoading(true);try{const r=await getEmployeeAssets(employeeId,{page:1,limit:100,sortBy:"createdAt:desc"});const p=r?.data??r;const rows=p?.results??p?.assets??p?.docs??p;if(live)setAssets(Array.isArray(rows)?rows:[]);}catch(e){if(live){setAssets([]);toast.error(e.response?.data?.message||e.message||"Failed to fetch employee assets");}}finally{if(live)setLoading(false);}})();
    return()=>{live=false};
  },[employeeId,reload]);

  useEffect(()=>{if(!mode)return;const key=e=>{if(e.key==="Escape"&&!saving)setMode(null)};document.addEventListener("keydown",key);const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=old}},[mode,saving]);

  const create=()=>{setSelected(null);setForm(blank);setMode("create")};
  const edit=a=>{setSelected(a);setForm({assetName:a.assetName||"",assetSerialNumber:a.assetSerialNumber||"",assetType:a.assetType||"issued",assetDescription:a.assetDescription||"",assetContition:a.assetContition||"new",assetStatus:a.assetStatus||"currently_using",issuedDate:a.issuedDate?new Date(a.issuedDate).toISOString().slice(0,10):""});setMode("edit")};
  const close=()=>{if(!saving){setMode(null);setSelected(null)}};
  const change=({target:{name,value}})=>setForm(f=>({...f,[name]:value}));
  const save=async e=>{e.preventDefault();setSaving(true);const payload={...form,issuedDate:form.issuedDate?new Date(`${form.issuedDate}T00:00:00.000Z`).toISOString():undefined};try{
    if(mode==="edit"){await updateAsset(selected._id||selected.id,payload);toast.success("Asset updated successfully");}
    else{const r=await createAsset(payload);const a=r?.data?.asset||r?.asset||r?.data||r;const id=a?._id||a?.id;if(!id)throw new Error("Asset ID was not returned");await assignAsset(id,employeeId,{issuedDate:payload.issuedDate});toast.success("Asset created and assigned successfully");}
    setMode(null);setSelected(null);setReload(x=>x+1);
  }catch(err){toast.error(err.response?.data?.message||err.message||"Failed to save asset");}finally{setSaving(false)}};

  return <><Card><Header><Title><Icon><FiList/></Icon>Assets List</Title><Primary type="button" onClick={create}><IoAdd/>New Asset</Primary></Header>
    <Table><thead><tr><th>Asset Name</th><th>Serial / Asset ID</th><th>Issue Date</th><th>Asset Condition</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {assets.map(a=><tr key={a._id||a.id} onClick={()=>edit(a)}><td>{a.assetName||"-"}</td><td>{a.assetSerialNumber||"-"}</td><td>{dateLabel(a.issuedDate)}</td><td>{label(a.assetContition)}</td><Status>{label(a.assetStatus)}</Status><Action><FiEdit3/></Action></tr>)}
      {loading&&<tr><Empty colSpan="6">Loading assets...</Empty></tr>}{!loading&&!assets.length&&<tr><Empty colSpan="6">No assets assigned to this employee</Empty></tr>}
    </tbody></Table></Card>
    <Shade $open={!!mode} onClick={close}/><Modal $open={!!mode} role="dialog" aria-modal="true"><ModalHead><h2>{mode==="edit"?"Edit Asset":"New Asset"}</h2><Close onClick={close} type="button"><IoClose/></Close></ModalHead>
      <Form onSubmit={save}><Field><label>Asset Name</label><input required name="assetName" value={form.assetName} onChange={change}/></Field><Field><label>Serial / Asset ID</label><input required name="assetSerialNumber" value={form.assetSerialNumber} onChange={change}/></Field>
      <Field><label>Asset Type</label><select name="assetType" value={form.assetType} onChange={change}><option value="issued">Issued</option><option value="owned">Owned</option><option value="leased">Leased</option></select></Field><Field><label>Condition</label><select name="assetContition" value={form.assetContition} onChange={change}><option value="new">New</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></select></Field>
      <Field><label>Status</label><select name="assetStatus" value={form.assetStatus} onChange={change}><option value="currently_using">Currently Using</option><option value="returned">Returned</option><option value="lost">Lost</option><option value="damaged">Damaged</option></select></Field><Field><label>Issued Date</label><input type="date" name="issuedDate" value={form.issuedDate} onChange={change}/></Field>
      <Field $wide><label>Description</label><textarea name="assetDescription" value={form.assetDescription} onChange={change} rows="3"/></Field><Buttons><Secondary type="button" onClick={close}>Cancel</Secondary><Primary disabled={saving}>{saving?"Saving...":mode==="edit"?"Update Asset":"Create Asset"}</Primary></Buttons></Form>
    </Modal></>;
}

const Card=styled.section`width:100%;background:#fff;border:1px solid #e3e7e9;border-radius:10px;padding:22px;color:#10282c;`;
const Header=styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;`;
const Title=styled.h2`display:flex;align-items:center;gap:12px;margin:0;font:600 18px "Inter-SemiBold",sans-serif;`;
const Icon=styled.span`width:44px;height:44px;border-radius:8px;background:#f1f7f7;color:#006d78;display:grid;place-items:center;font-size:22px;`;
const Primary=styled.button`display:flex;align-items:center;gap:7px;border:0;border-radius:7px;background:#066c78;color:#fff;padding:10px 16px;font-weight:600;cursor:pointer;&:disabled{opacity:.6}`;
const Table=styled.table`width:100%;border-collapse:collapse;font-size:14px;th,td{padding:16px 12px;text-align:left;border-top:1px solid #e7eaec}th{color:#697477;font-weight:500}tbody tr{cursor:pointer}tbody tr:hover{background:#f7fafa}`;
const Status=styled.td`color:#006f7a;`;const Action=styled.td`color:#007382;font-size:18px;`;const Empty=styled.td`text-align:center!important;color:#73787a;padding:28px!important;`;
const Shade=styled.div`position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.55);opacity:${p=>p.$open?1:0};visibility:${p=>p.$open?"visible":"hidden"};transition:.2s;`;
const Modal=styled.div`position:fixed;z-index:1101;left:50%;top:50%;width:min(680px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;background:#fff;border-radius:12px;box-shadow:0 18px 60px #0004;opacity:${p=>p.$open?1:0};visibility:${p=>p.$open?"visible":"hidden"};transform:translate(-50%,-50%) scale(${p=>p.$open?1:.96});transition:.2s;`;
const ModalHead=styled.div`padding:20px 24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dfe4e6;h2{margin:0;font-size:22px}`;const Close=styled.button`border:0;background:none;color:#8297b8;font-size:28px;display:flex;cursor:pointer;`;
const Form=styled.form`padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:18px 20px;@media(max-width:600px){grid-template-columns:1fr}`;
const Field=styled.div`display:flex;flex-direction:column;gap:7px;${p=>p.$wide&&"grid-column:1/-1"};label{font-size:14px;color:#46565a}input,select,textarea{border:1px solid #ccd5d8;border-radius:7px;padding:11px 12px;color:#10282c;font:400 14px "Inter",sans-serif;outline:none}input:focus,select:focus,textarea:focus{border-color:#087681}textarea{resize:vertical}`;
const Buttons=styled.div`grid-column:1/-1;display:flex;justify-content:flex-end;gap:12px;`;const Secondary=styled.button`border:1px solid #ccd5d8;border-radius:7px;background:#fff;padding:10px 18px;cursor:pointer;`;
