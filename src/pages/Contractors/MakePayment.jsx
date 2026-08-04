import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import styled from "styled-components";
import Button from "../../components/Button";

const workDetails = [
  {
    region: "Headquarters",
    groups: [
      {
        date: "10/Apr/2026",
        total: 240,
        jobs: [{ job: "AC Installation", quantity: "2 Piece", price: 120, total: 240 }],
      },
      {
        date: "12/Apr/2026",
        total: 1250,
        jobs: [{ job: "Duct Cleaning", quantity: "500 Sq. Ft.", price: 2.5, total: 1250 }],
      },
    ],
  },
  {
    region: "North Region",
    groups: [
      {
        date: "15/Apr/2026",
        total: 450,
        jobs: [{ job: "Routine Maintenance", quantity: "10 Hour", price: 45, total: 450 }],
      },
    ],
  },
];

const money = (value) => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const MakePayment = () => {
  const { contractorName } = useParams();
  const navigate = useNavigate();
  const name = contractorName || "Safeeq";
  const [selected, setSelected] = useState(() =>
    workDetails.flatMap((section, sectionIndex) =>
      section.groups.flatMap((group, groupIndex) =>
        group.jobs.map((_, jobIndex) => `${sectionIndex}-${groupIndex}-${jobIndex}`),
      ),
    ),
  );
  const [tcs, setTcs] = useState(true);
  const [gst, setGst] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const selectedTotal = useMemo(
    () =>
      workDetails.reduce(
        (sum, section, sectionIndex) =>
          sum +
          section.groups.reduce(
            (groupSum, group, groupIndex) =>
              groupSum +
              group.jobs.reduce(
                (jobSum, job, jobIndex) =>
                  jobSum +
                  (selected.includes(`${sectionIndex}-${groupIndex}-${jobIndex}`) ? job.total : 0),
                0,
              ),
            0,
          ),
        0,
      ),
    [selected],
  );

  const tcsAmount = tcs ? selectedTotal * 0.01 : 0;
  const gstAmount = gst ? selectedTotal * 0.18 : 0;
  const netPayable = selectedTotal - tcsAmount + gstAmount;
  const toggleJob = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const toggleSection = (sectionIndex) => {
    const ids = workDetails[sectionIndex].groups.flatMap((group, groupIndex) =>
      group.jobs.map((_, jobIndex) => `${sectionIndex}-${groupIndex}-${jobIndex}`),
    );
    const allSelected = ids.every((id) => selected.includes(id));
    setSelected((current) =>
      allSelected ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])],
    );
  };

  return (
    <Page>
      <Heading>
        <h1>Pay {name}</h1>
        <p>Process payment for outstanding work logs.</p>
      </Heading>

      <Card>
        <CardTitle>Payment Details</CardTitle>
        <Fields>
          <Field>
            <label>Payment Date</label>
            <input type="text" defaultValue="24 Oct 2023" />
          </Field>
          <Field>
            <label>Payment Via</label>
            <SelectWrap>
              <select defaultValue="Bank Transfer">
                <option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>UPI</option>
              </select>
              <FiChevronDown />
            </SelectWrap>
          </Field>
          <Field>
            <label>Payment Reference</label>
            <input placeholder="e.g. UTR Number or Transaction ID" />
          </Field>
        </Fields>
        <Field>
          <label>Remarks</label>
          <textarea placeholder="Add any relevant details or notes about this payment..." />
        </Field>
      </Card>

      {workDetails.map((section, sectionIndex) => {
        const sectionIds = section.groups.flatMap((group, groupIndex) =>
          group.jobs.map((_, jobIndex) => `${sectionIndex}-${groupIndex}-${jobIndex}`),
        );
        return (
          <Card key={section.region}>
            <CardTitle>Work Details - {section.region}</CardTitle>
            <TableShell>
              <table>
                <thead><tr>
                  <th><Check type="checkbox" checked={sectionIds.every((id) => selected.includes(id))} onChange={() => toggleSection(sectionIndex)} /></th>
                  <th>S.No</th><th>Job Detail</th><th>Quantity</th><th>Price/Unit</th><th>Remarks</th><th>Total Amount</th>
                </tr></thead>
                <tbody>
                  {section.groups.map((group, groupIndex) => (
                    <GroupRows key={group.date} group={group} sectionIndex={sectionIndex} groupIndex={groupIndex} selected={selected} toggleJob={toggleJob} />
                  ))}
                </tbody>
              </table>
            </TableShell>
          </Card>
        );
      })}

      <BreakdownArea>
        {showBreakdown && (
          <Breakdown>
            <AmountRow><span>Total Amount</span><strong>{money(selectedTotal)}</strong></AmountRow>
            <AmountRow><Toggle type="button" $active={tcs} onClick={() => setTcs(!tcs)}><i /></Toggle><span>TCS (1%)</span><strong className="deduction">-{money(tcsAmount)}</strong></AmountRow>
            <AmountRow><Toggle type="button" $active={gst} onClick={() => setGst(!gst)}><i /></Toggle><span>GST (18%)</span><strong>{money(gstAmount)}</strong></AmountRow>
            <Divider />
            <NetRow><strong>Net Payable</strong><b>{money(netPayable)}</b></NetRow>
          </Breakdown>
        )}
      </BreakdownArea>

      <Footer>
        <Summary type="button" onClick={() => setShowBreakdown(!showBreakdown)}>
          <span><small>Net Payable</small><strong>{money(netPayable)}</strong></span>
          {showBreakdown ? <FiChevronDown /> : <FiChevronUp />}
        </Summary>
        <Button text="Save Payment" icon={<FiCheckCircle />} bg="#edab18" color="#fff" radius="8px" fontSize="14px" fontWeight={500} onClick={() => navigate(`/admin/contractors/payment-receipt/${name}`)} />
      </Footer>
    </Page>
  );
};

const GroupRows = ({ group, sectionIndex, groupIndex, selected, toggleJob }) => (
  <>
    <tr className="date-row">
      <td><Check type="checkbox" checked={group.jobs.every((_, jobIndex) => selected.includes(`${sectionIndex}-${groupIndex}-${jobIndex}`))} onChange={() => group.jobs.forEach((_, jobIndex) => toggleJob(`${sectionIndex}-${groupIndex}-${jobIndex}`))} /></td>
      <td colSpan="5"><strong>{group.date}</strong></td><td className="amount"><strong>{money(group.total)}</strong></td>
    </tr>
    {group.jobs.map((job, jobIndex) => {
      const id = `${sectionIndex}-${groupIndex}-${jobIndex}`;
      return <tr key={id}>
        <td><Check type="checkbox" checked={selected.includes(id)} onChange={() => toggleJob(id)} /></td>
        <td>{jobIndex + 1}</td><td>{job.job}</td><td>{job.quantity}</td><td>{money(job.price)}</td>
        <td><Remark placeholder="Add remark" /></td><td className="amount"><strong>{money(job.total)}</strong></td>
      </tr>;
    })}
  </>
);

const Page = styled.main`min-height:100vh;background:#f3f5f9;padding:35px 24px 90px;font-family:Inter,sans-serif;color:#111827;box-sizing:border-box;`;
const Heading = styled.header`margin-bottom:28px;h1{font-size:24px;line-height:1.2;margin:0 0 6px;font-weight:700}p{margin:0;color:#8a8a8a;font-size:14px}`;
const Card = styled.section`background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:21px;margin-bottom:24px;`;
const CardTitle = styled.h2`font-size:16px;margin:0 0 17px;font-weight:600;`;
const Fields = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-bottom:20px;@media(max-width:800px){grid-template-columns:1fr}`;
const Field = styled.div`display:flex;flex-direction:column;gap:7px;label{font-size:12px;color:#263238}input,textarea,select{box-sizing:border-box;width:100%;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#757575;font:400 13px Inter,sans-serif;outline:none}input,select{height:42px;padding:0 12px}textarea{height:80px;padding:12px;resize:vertical}input:focus,textarea:focus,select:focus{border-color:#0047ab;box-shadow:0 0 0 2px rgba(0,71,171,.08)}}`;
const SelectWrap = styled.div`position:relative;select{appearance:none;padding-right:35px}svg{position:absolute;right:12px;top:13px;color:#777;pointer-events:none}`;
const TableShell = styled.div`border:1px solid rgba(0,0,0,.08);border-radius:8px;overflow:auto;table{border-collapse:collapse;width:100%;min-width:800px;font-size:12px}th{height:42px;background:#f1f4f5;color:#737373;font-size:11px;font-weight:500;text-align:left;padding:0 16px}th:first-child,td:first-child{width:34px;text-align:center;padding-left:16px;padding-right:8px}td{height:58px;padding:0 16px;border-bottom:1px solid rgba(0,0,0,.08);white-space:nowrap}.date-row td{height:43px;background:#eef1f2}.amount{text-align:right}tbody tr:last-child td{border-bottom:0}}`;
const Check = styled.input`width:16px;height:16px;accent-color:#0047ab;cursor:pointer;`;
const Remark = styled.input`width:100%;min-width:180px;height:32px;border:1px solid #d1d5db;border-radius:6px;padding:0 10px;font:12px Inter,sans-serif;box-sizing:border-box;outline:none;&:focus{border-color:#0047ab}`;
const BreakdownArea = styled.div`min-height:197px;`;
const Breakdown = styled.div`width:340px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:21px;box-sizing:border-box;box-shadow:0 10px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);@media(max-width:500px){width:100%}`;
const AmountRow = styled.div`display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;margin-bottom:16px;color:#6b7280;font-size:14px;&:first-child{grid-template-columns:1fr auto}strong{font-weight:600;color:#111827}.deduction{color:#ef4444}`;
const Toggle = styled.button`width:36px;height:20px;border:0;border-radius:20px;background:${({$active})=>$active?"#0047ab":"#d1d5db"};padding:2px;display:flex;justify-content:${({$active})=>$active?"flex-end":"flex-start"};cursor:pointer;i{width:16px;height:16px;background:#fff;border-radius:50%}`;
const Divider = styled.div`height:1px;background:rgba(0,0,0,.08);margin:4px 0 16px;`;
const NetRow = styled.div`display:flex;justify-content:space-between;align-items:center;font-size:18px;b{font-size:16px;color:#0047ab}`;
const Footer = styled.footer`position:fixed;z-index:10;left:260px;right:0;bottom:0;height:70px;padding:0 48px 0 24px;background:#fff;border-top:1px solid rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;@media(max-width:900px){left:0;padding:0 20px}`;
const Summary = styled.button`border:1px solid rgba(0,0,0,.08);border-radius:8px;background:rgba(0,71,171,.1);padding:8px 12px;display:flex;align-items:center;gap:16px;color:#111827;cursor:pointer;span{display:flex;flex-direction:column;align-items:flex-start;gap:2px}small{font:500 10px Inter;color:#6b7280}strong{font:700 14px Inter}svg{width:24px;height:24px;padding:5px;box-sizing:border-box;border-radius:50%;background:#fff}`;

export default MakePayment;
