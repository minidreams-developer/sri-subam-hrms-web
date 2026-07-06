import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import theme from "../../theme/theme";
import megaphoneIcon from "../../assets/images/dashboardImages/megaphone_svgrepo.com.svg";

const Announcement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    scheduleDateAndTime: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        setAnnouncementsError(null);
        
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/announcements`;
        console.log("🔗 Fetching announcements from:", apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("✅ Announcements fetched successfully:", response.data);
        
        // Transform API data to component format
        const results = response.data?.results || [];
        const transformedAnnouncements = (Array.isArray(results) ? results : []).map((announcement) => {
          const images = announcement.images && announcement.images.length > 0 
            ? announcement.images.map(img => ({
                _id: img._id,
                imgName: img.imgName,
                imgUrl: img.imgUrl
              }))
            : [];
          
          console.log("📸 Processing announcement images:", {
            title: announcement.title,
            hasImages: announcement.images && announcement.images.length > 0,
            imageCount: announcement.images?.length || 0,
            images: images
          });

          return {
            id: announcement._id || announcement.id,
            title: announcement.title || "Untitled",
            content: announcement.content || announcement.description || "",
            date: new Date(announcement.scheduleDateAndTime || announcement.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) + " - " + new Date(announcement.scheduleDateAndTime || announcement.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            hasImage: images.length > 0,
            images: images
          };
        });

        setAnnouncements(transformedAnnouncements);
      } catch (error) {
        console.error("❌ Error fetching announcements:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            "Failed to fetch announcements";
        setAnnouncementsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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

  const handlePublish = async () => {
    // Validate form
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.message?.trim()) {
      toast.error("Message is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build images array from uploaded files
      const images = uploadedFiles.map((file, index) => ({
        imgName: file.name.split('.')[0] || `image-${index}`,
        imgUrl: URL.createObjectURL(file.file) // In production, upload file and get URL from API
      }));

      // Build payload according to API spec
      const payload = {
        title: formData.title?.trim() || "",
        description: formData.message?.substring(0, 100) || "",
        content: formData.message?.trim() || "",
        scheduleDateAndTime: formData.scheduleDateAndTime || new Date().toISOString(),
        images: images
      };

      console.log("📤 Submitting announcement payload:", JSON.stringify(payload, null, 2));
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/announcements`;
      console.log("🔗 API URL:", apiUrl);

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("✅ Announcement published successfully:", response.data);
      toast.success("Announcement published successfully!");
      
      // Reset form
      setFormData({
        title: "",
        message: "",
        scheduleDateAndTime: "",
      });
      setUploadedFiles([]);
      setShowNewAnnouncement(false);

      // Refresh announcements list
      const fetchAnnouncements = async () => {
        try {
          const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/announcements`;
          const response = await axios.get(apiUrl, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          const results = response.data?.results || [];
          const transformedAnnouncements = (Array.isArray(results) ? results : []).map((announcement) => {
            return {
              id: announcement._id || announcement.id,
              title: announcement.title || "Untitled",
              content: announcement.content || announcement.description || "",
              date: new Date(announcement.scheduleDateAndTime || announcement.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) + " - " + new Date(announcement.scheduleDateAndTime || announcement.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              hasImage: announcement.images && announcement.images.length > 0,
              images: announcement.images && announcement.images.length > 0 
                ? announcement.images.map(img => ({
                    _id: img._id,
                    imgName: img.imgName,
                    imgUrl: img.imgUrl
                  }))
                : []
            };
          });

          setAnnouncements(transformedAnnouncements);
        } catch (error) {
          console.error("❌ Error refreshing announcements:", error);
        }
      };

      fetchAnnouncements();
      
    } catch (error) {
      console.error("❌ Error publishing announcement:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to publish announcement";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
              <CancelButton onClick={() => setShowNewAnnouncement(false)} disabled={isSubmitting}>
                Cancel
              </CancelButton>
              <PublishButton onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
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
        {announcementsLoading ? (
          <LoadingMessage>Loading announcements...</LoadingMessage>
        ) : announcementsError ? (
          <ErrorMessage>{announcementsError}</ErrorMessage>
        ) : announcements.length === 0 ? (
          <EmptyMessage>No announcements found</EmptyMessage>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id}>
              <CardHeader>
                <IconWrapper>
                  <IconImage src={megaphoneIcon} alt="announcement" />
                </IconWrapper>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDate>{announcement.date}</CardDate>
              </CardHeader>
              {announcement.content && <CardContent>{announcement.content}</CardContent>}
              {announcement.hasImage && announcement.images && announcement.images.length > 0 && (
                <CardImages>
                  {announcement.images.map((image, idx) => {
                    console.log("🖼️ Rendering image:", { imgName: image.imgName, imgUrl: image.imgUrl });
                    return (
                      <ImagePlaceholder 
                        key={image._id || idx} 
                        src={image.imgUrl}
                        alt={image.imgName || `Image ${idx}`}
                        title={image.imgName || `Image ${idx}`}
                        onError={(e) => {
                          console.error("❌ Image failed to load:", { src: image.imgUrl, error: e });
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log("✅ Image loaded successfully:", image.imgUrl);
                        }}
                      />
                    );
                  })}
                </CardImages>
              )}
            </AnnouncementCard>
          ))
        )}
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-family: "Inter", sans-serif;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  font-family: "Inter", sans-serif;
  background: #fee2e2;
  border-radius: 8px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-family: "Inter", sans-serif;
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

const ImagePlaceholder = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid #ddd;
  display: block;
  
  &:not([src]) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
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

  &:hover:not(:disabled) {
    background: #F5F5F5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:hover:not(:disabled) {
    background: #003580;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Announcement;
