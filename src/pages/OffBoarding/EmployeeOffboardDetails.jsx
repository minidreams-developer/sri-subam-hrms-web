import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import DocIcon from "../../assets/images/employee/document.svg";
import EditIcon from "../../assets/images/employee/edit-05_svgrepo.com.svg";
import CardDetails from "../../components/CardDetails";
import CardDetailsAlt from "../../components/CardDetailsAlt";
import FileUploadComponent from "../../components/FileUploadComponent";
import CheckboxGroup from "../../components/CheckboxGroup";
import { getOffboard } from "../../services/apiServices";
import { toast } from "react-toastify";

const earnings = [
  "Last Month Salary",
  "Pending Salary",
  "Leave Encashment",
  "Bonus / Incentives",
  "Reimbursements",
];

const deductions = [
  "Notice Pay",
  "Asset Damage",
  "Loan Recovery",
  "Advance Salary",
  "Tax Adjustments",
];

export const EmployeeOffboardDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setHeaderTitle, setHeaderBackAction } = useOutletContext();
  const [docFiles, setDocFiles] = useState([]);
  const [offboard, setOffboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = location.state?.offboardId;
    if (!id) {
      toast.error("Offboarding record ID is missing");
      setLoading(false);
      return;
    }
    getOffboard(id)
      .then((response) => {
        const record = response?.data || response?.result || response;
        setOffboard(record);
        setDocFiles(
          (record?.userDocuments || []).map((document, index) => ({
            label: document?.label || document?.name || `Document ${index + 1}`,
            fileName: document?.fileName || document?.name || document?.url || "Document",
          })),
        );
      })
      .catch((error) => toast.error(error.response?.data?.message || "Failed to load offboarding details"))
      .finally(() => setLoading(false));
  }, [location.state?.offboardId]);

  useEffect(() => {
    setHeaderTitle("Employee Off-Board Details");
    setHeaderBackAction(() => () => navigate("/admin/peopleHub/off-boarding"));
    return () => {
      setHeaderTitle("");
      setHeaderBackAction(null);
    };
  }, [navigate, setHeaderBackAction, setHeaderTitle]);

  const handleUpload = (file) => {
    const extension = file?.name?.split(".").pop()?.toLowerCase();
    const label = extension === "pdf" ? "PDF" : "Document";
    setDocFiles((files) => [...files, { label, fileName: file.name }]);
  };

  if (loading) return <PageCard>Loading offboarding details...</PageCard>;

  const user = offboard?.userId || offboard?.user || {};
  const workInformation = user.workInformation || {};
  const department = workInformation.department || user.department || {};
  const branch = workInformation.branch || {};
  const shift = workInformation.shiftId && typeof workInformation.shiftId === "object"
    ? workInformation.shiftId
    : {};
  const team = workInformation.team || user.team || {};
  const reportingPerson = workInformation.reportingPerson || user.reportingPerson || {};
  const exit = offboard?.exitInformation || offboard || {};
  const settlement = offboard?.finalSettlemelastMonthSalary || {};
  const toYesNo = (value) => (value === true ? "Yes" : value === false ? "No" : "N/A");
  const formatDate = (value) => {
    if (!value) return "N/A";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  return (
    <PageCard>
      <HeaderRow>
        <Heading>
          <IconWrap><img src={DocIcon} alt="" /></IconWrap>
          <Title>Off-Board Details</Title>
        </Heading>
        <EditButton
          type="button"
          onClick={() => navigate("/admin/peopleHub/off-boarding/createEmployeeOffBoard", {
            state: { offboardId: offboard?._id || offboard?.id },
          })}
        >
          <img src={EditIcon} alt="" />
          Edit details
        </EditButton>
      </HeaderRow>

      <CardDetails
        title="Employee Details"
        columns={3}
        items={[
          { label: "Employee ID", value: user.employeeId || "N/A" },
          { label: "Employee", value: user.name || "N/A" },
          { label: "Email", value: user.email || "N/A" },
          { label: "Date Of Joining", value: formatDate(workInformation.joinedDate || user.dateOfJoining) },
          { label: "Department", value: department.departmentName || department.name || "N/A" },
          { label: "Designation", value: workInformation.designation?.name || workInformation.designation || user.designation || "N/A" },
          { label: "Team", value: team.teamName || team.name || team.teamCode || (typeof team === "string" ? team : "N/A") },
          { label: "Reporting Manager", value: reportingPerson.name || "N/A" },
          { label: "Experience Type", value: workInformation.experienceType || "N/A" },
          { label: "Total Experience", value: workInformation.totalExperience || "N/A" },
          { label: "Location", value: workInformation.location || "N/A" },
          { label: "Branch", value: branch.branchName || "N/A" },
          { label: "Shift", value: shift.shiftName || "N/A" },
          { label: "Attendance Type", value: workInformation.AttendanceType || "N/A" },
        ]}
      />

      <CardDetails
        title="Exit Information Section"
        columns={3}
        items={[
          { label: "Exit Type", value: exit.exitType || "N/A" },
          { label: "Exit Reason", value: exit.exitReason || "N/A" },
          { label: "Resignation Submitted Date", value: formatDate(exit.resignationSubmitionDate || exit.resignationSubmittedDate || exit.resignationDate) },
          { label: "Last Working Date", value: formatDate(exit.lastWorkingDate) },
          { label: "Notice Period", value: exit.noticePeriod || "N/A" },
          { label: "Actual Notice Served", value: exit.actualNoticePeriod || "N/A" },
          { label: "Waiver", value: toYesNo(exit.waiver) },
          { label: "Exit Approved By", value: exit.exitApprovedBy?.name || reportingPerson.name || exit.exitApprovedBy || "N/A" },
          { label: "Approval Date", value: formatDate(exit.approvalDate) },
          { label: "Status", value: offboard.status || "N/A" },
        ]}
      />

      <CardDetails
        title="Asset Management"
        columns={3}
        items={(offboard?.assetDetails || []).flatMap((asset, index) => [
          { label: `Asset ${index + 1}`, value: asset.assetName || "N/A" },
          { label: "Serial Number", value: asset.assetSerialNumber || "N/A" },
          { label: "Asset Status", value: asset.assetStatus || "N/A" },
          { label: "Returned", value: toYesNo(asset.isReturned) },
          { label: "Issued Date", value: formatDate(asset.issuedDate) },
        ])}
      />

      <Section>
        <SectionTitle>Final Settlement (FnF) Details</SectionTitle>
        <TintedPanel>
          <CheckboxGroup
            title="Earnings"
            options={earnings}
            defaultChecked={[
              settlement.lastMonthSalary && "Last Month Salary",
              settlement.pendingSalary && "Pending Salary",
              settlement.leaveEncashment && "Leave Encashment",
              settlement.bonus_incentives && "Bonus / Incentives",
              settlement.reimbursements && "Reimbursements",
            ].filter(Boolean)}
          />
          <CheckboxGroup
            title="Deductions"
            options={deductions}
            defaultChecked={[
              settlement.noticePay && "Notice Pay",
              settlement.assetDamge && "Asset Damage",
              settlement.loanRecovery && "Loan Recovery",
              settlement.advanceSalary && "Advance Salary",
              settlement.taxAdjustments && "Tax Adjustments",
            ].filter(Boolean)}
          />
        </TintedPanel>
      </Section>

      <Section>
        <SectionTitle>Documents Return (Originals)</SectionTitle>
        <TintedPanel>
          <CheckboxGroup
            options={["10th Marksheet", "12th Marksheet"]}
            defaultChecked={[
              settlement.tenth_marksheet && "10th Marksheet",
              settlement.twelevth_marksheet && "12th Marksheet",
            ].filter(Boolean)}
          />
        </TintedPanel>
      </Section>

      <CardDetailsAlt title="Documents" columns={3} onUpload={handleUpload} accept="*">
        {docFiles.map((doc, index) => (
          <FileUploadComponent key={`${doc.fileName}-${index}`} label={doc.label} fileName={doc.fileName} />
        ))}
      </CardDetailsAlt>
    </PageCard>
  );
};

export default EmployeeOffboardDetails;

const PageCard = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;
  border-radius: 10px;
  background: ${theme.colors.white};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
`;

const IconWrap = styled.span`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: ${theme.colors.secondaryPrimary};
  img { width: 20px; height: 20px; }
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.textColor};
  font: 600 1.125rem/1.6 "Inter-SemiBold", sans-serif;
`;

const EditButton = styled.button`
  width: 200px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border: 0;
  border-radius: 8px;
  background: ${theme.colors.secondaryPrimary};
  color: ${theme.colors.primary};
  font: 600 0.875rem/1.6 "Inter-SemiBold", sans-serif;
  cursor: pointer;
  img { width: 24px; height: 24px; }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.primary};
  font: 600 1rem/1.6 "Inter-SemiBold", sans-serif;
`;

const TintedPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.875rem 1.25rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: rgba(237, 246, 249, 0.4);
`;
