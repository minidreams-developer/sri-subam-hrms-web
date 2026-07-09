import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { toast } from "react-toastify";
import { get } from "../../helpers/api_helper";
import { SERIES_CONFIGURATION } from "../../helpers/url_helper";

const SeriesConfiguration = () => {
  const navigate = useNavigate();
  const [seriesList, setSeriesList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSeriesData();
  }, []);

  const fetchSeriesData = async () => {
    setIsLoading(true);
    try {
      const response = await get(SERIES_CONFIGURATION);
      
      // Extract results array from paginated response
      let data = [];
      if (response?.results) {
        data = response.results;
      } else if (Array.isArray(response)) {
        data = response;
      } else if (response && typeof response === 'object') {
        data = [response];
      }
      
      setSeriesList(data);
      console.log("Series Data:", data);
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.error("Failed to fetch series");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSeries = () => {
    navigate("/admin/settings/seriesConfiguration/add");
  };

  const handleActionClick = (row) => {
    // TODO: Implement edit/delete functionality
    console.log("Action clicked for:", row);
  };

  const filteredData = seriesList.filter((item) =>
    item.seriesName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    { label: "Series Name", key: "seriesName" },
    { label: "Voucher Type", key: "voucherType" },
    { label: "Prefix", key: "prefix" },
    { label: "Suffix", key: "suffix" },
    { label: "Starting No", key: "startingNo" },
    { label: "Length of Zero", key: "lengthOfZero" },
    {
      label: "Actions",
      key: "actions",
      render: () => <ActionDots>⋯</ActionDots>,
      align: "right",
    },
  ];

  return (
    <PageWrapper>
      <HeaderSection>
        <PageTitle>All Series</PageTitle>
        <ControlsSection>
          <SearchWrap>
            <SearchInputComponent
              placeholder="Search Series"
              value={searchValue}
              onSearchChange={setSearchValue}
              width="100%"
              height="40px"
            />
          </SearchWrap>
          <Button
            text="New series"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="auto"
            radius="0.625rem"
            icon={<img src={PlusIcon} alt="add" width="16" height="16" />}
            onClick={handleAddSeries}
          />
        </ControlsSection>
      </HeaderSection>

      <TableWrapper>
        <ReusableTable
          columns={columns}
          data={filteredData}
          rowsPerPage={10}
          totalResults={filteredData.length}
          isLoading={isLoading}
          emptyStateText="No series configured yet"
          actionBtnClicked={handleActionClick}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SeriesConfiguration;

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 0;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0 0 1rem 0;
`;

const PageTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  white-space: nowrap;
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
`;

const SearchWrap = styled.div`
  width: 20rem;
  max-width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SuffixText = styled.span`
  color: ${theme.colors.primary};
  font-weight: 500;
`;

const ActionDots = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.textColor};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding-right: 1rem;

  &:hover {
    color: ${theme.colors.primary};
  }
`;
