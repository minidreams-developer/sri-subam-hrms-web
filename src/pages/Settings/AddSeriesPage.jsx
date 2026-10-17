import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddNewSeries from "../../components/addnewseries";

const AddSeriesPage = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate("/admin/settings/seriesConfiguration");
  };

  const handleSave = (formData) => {
    // API call is already made in AddNewSeries component
    // Just navigate back to the list
    navigate("/admin/settings/seriesConfiguration");
  };

  return (
    <PageWrapper>
      <AddNewSeries
        onClose={handleClose}
        onSave={handleSave}
        initialData={location.state?.series}
        mode={mode}
      />
    </PageWrapper>
  );
};

export default AddSeriesPage;

const PageWrapper = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;
