import { useState } from "react";
import styled from "styled-components";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import theme from "../../theme/theme";
import megaphoneIcon from "../../assets/images/dashboardImages/megaphone_svgrepo.com.svg";

const Announcement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const announcements = [
    {
      id: 1,
      title: "Lorem Ipsum is simply dummy",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
      date: "26 Dec - 03:26 pm",
      hasImage: false,
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet consectetur. Duis arcu condimentum massa odio purus.",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
      date: "26 Dec - 03:26 pm",
      hasImage: false,
    },
    {
      id: 3,
      title: "Lorem Ipsum is simply dummy",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      date: "26 Dec - 03:26 pm",
      hasImage: true,
      images: [1, 2],
    },
    {
      id: 4,
      title: "Lorem ipsum dolor sit amet consectetur. Duis arcu condimentum massa odio purus.",
      content: "",
      date: "26 Dec - 03:26 pm",
      hasImage: true,
      images: [1],
    },
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  if (showNewAnnouncement) {
    return (
      <Container>
        <PageHeader>
          <Breadcrumb>
            <Crumb onClick={() => setShowNewAnnouncement(false)} style={{cursor: 'pointer'}}>Announcement</Crumb>
            <CrumbSeparator>›</CrumbSeparator>
            <Crumb active>New Announcement</Crumb>
          </Breadcrumb>
        </PageHeader>

        <ContentWrapper>
          {/* Form Sections */}
          <Section>
            <FormRow>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Message</Label>
                <TextArea
                  placeholder="Enter Message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </FormGroup>
            </FormRow>
          </Section>

          {/* Attachments Section */}
          <Section>
            <SectionHeader>
              <SectionTitle>Upload Files</SectionTitle>
            </SectionHeader>
            <DropZone
              onClick={() => document.getElementById('file-upload').click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              $isDragging={isDragging}
            >
              <input
                type="file"
                id="file-upload"
                hidden
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.svg"
                onChange={handleFileSelect}
              />
              <DropZoneText>
                <DropIcon>⬆️</DropIcon>
                Click to upload or drag and drop<br />
                Multiple files allowed
              </DropZoneText>
            </DropZone>

            {uploadedFiles.length > 0 && (
              <UploadedFilesList>
                {uploadedFiles.map(file => (
                  <UploadedFile key={file.id}>
                    <FileName>{file.name}</FileName>
                    <RemoveButton onClick={() => removeFile(file.id)}>×</RemoveButton>
                  </UploadedFile>
                ))}
              </UploadedFilesList>
            )}
          </Section>

          {/* Buttons */}
          <Footer>
            <ScheduleButton>
              Schedule
            </ScheduleButton>
            <ButtonGroup>
              <CancelButton onClick={() => setShowNewAnnouncement(false)}>
                Cancel
              </CancelButton>
              <PublishButton>
                Publish
              </PublishButton>
            </ButtonGroup>
          </Footer>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <Title>Announcement</Title>
      </PageHeader>

      <Toolbar>
        <SearchInputWrapper>
          <SearchInputComponent
            placeholder="Search Announcement"
            value={searchQuery}
            onSearchChange={setSearchQuery}
            width="400px"
            height="48px"
          />
        </SearchInputWrapper>
        <RightActions>
          <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
          </FilterSelect>
          <Button
            text="+ New Announcement"
            
            color={theme.colors.white}
            fontWeight="600"
            onClick={() => setShowNewAnnouncement(true)}
          />
        </RightActions>
      </Toolbar>

      <AnnouncementsList>
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id}>
            <CardHeader>
              <IconWrapper>
                <IconImage src={megaphoneIcon} alt="announcement" />
              </IconWrapper>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDate>{announcement.date}</CardDate>
            </CardHeader>
            {announcement.content && <CardContent>{announcement.content}</CardContent>}
            {announcement.hasImage && announcement.images && (
              <CardImages>
                {announcement.images.map((_, idx) => (
                  <ImagePlaceholder key={idx} />
                ))}
              </CardImages>
            )}
          </AnnouncementCard>
        ))}
      </AnnouncementsList>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const Crumb = styled.span`
  color: ${props => props.active ? "#222" : "#666"};
  font-family: "Inter", sans-serif;
`;

const CrumbSeparator = styled.span`
  color: #666;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (min-width: 769px) {
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const FilterSelect = styled.select`
  padding: 0 1rem;
  height: 48px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0047ab;
    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.1);
  }
`;

const AnnouncementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AnnouncementCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CardHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: #e0e7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
`;

const CardTitle = styled.h3`
  flex: 1;
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CardDate = styled.span`
  font-size: 0.8rem;
  color: #666;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  flex-shrink: 0;
`;

const CardContent = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin: 0 0 0 3.25rem;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
`;

const CardImages = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 0.75rem 0 0 3.25rem;
  flex-wrap: wrap;
`;

const ImagePlaceholder = styled.div`
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
`;

// New Announcement Form Styles
const ContentWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #222;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #222;
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
  max-width: 400px;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0047AB;
  }

  &::placeholder {
    color: #999;
  }
`;

const DropZone = styled.div`
  border: 2px dashed ${(props) => props.$isDragging ? '#0047AB' : theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => props.$isDragging ? '#F0F5FF' : '#F3F4F6'};

  &:hover {
    border-color: #0047AB;
    background: #F0F5FF;
  }
`;

const DropZoneText = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.85rem;
  color: #666;
`;

const DropIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const UploadedFilesList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadedFile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${theme.colors.bgColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
`;

const FileName = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #DC2626;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ScheduleButton = styled.button`
  padding: 0.75rem 2rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: white;
  color: #222;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: white;
  color: #222;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
  }
`;

const PublishButton = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  background: #0047AB;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #003580;
  }
`;

export default Announcement;
