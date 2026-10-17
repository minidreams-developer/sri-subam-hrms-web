import { useState, useEffect } from "react";
import styled from "styled-components";
import { createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from "../../services/apiServices";
import { toast } from "react-toastify";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import SearchInputComponent from "../../components/SearchInputComponent";
import DropdownComponent from "../../components/DropdownComponent";
import Button from "../../components/Button";
import CalenderInput from "../../components/CalenderInput";
import TimeInputComponent from "../../components/TimeInputComponent";
import { getStoredAuthUser } from "../../helpers/auth_helper";
import theme from "../../theme/theme";
import megaphoneIcon from "../../assets/images/dashboardImages/megaphone_svgrepo.com.svg";
import uploadIcon from "../../assets/images/Common/upload.svg";
import { uploadMedia } from "../../helpers/uploadMedia";

const Announcement = () => {
  const { setHeaderTitle, setHeaderBackAction } = useOutletContext();
  const isAdmin = getStoredAuthUser()?.user?.role?.toLowerCase() === "admin";
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Published");
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
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
  const [isUploading, setIsUploading] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  const closeForm = () => {
    setShowNewAnnouncement(false);
    setEditingAnnouncement(null);
    setFormData({ title: "", message: "", scheduleDateAndTime: "" });
    setUploadedFiles([]);
    setShowSchedulePicker(false);
  };

  const updateScheduledDate = (selectedDate) => {
    if (!selectedDate) return;
    const current = formData.scheduleDateAndTime
      ? new Date(formData.scheduleDateAndTime)
      : new Date();
    const combined = new Date(selectedDate);
    combined.setHours(current.getHours(), current.getMinutes(), 0, 0);
    setFormData((previous) => ({
      ...previous,
      scheduleDateAndTime: combined.toISOString(),
    }));
  };

  const updateScheduledTime = (selectedTime) => {
    if (!selectedTime) return;
    const combined = formData.scheduleDateAndTime
      ? new Date(formData.scheduleDateAndTime)
      : new Date();
    combined.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    setFormData((previous) => ({
      ...previous,
      scheduleDateAndTime: combined.toISOString(),
    }));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    setHeaderTitle(showNewAnnouncement ? (editingAnnouncement ? "Edit Announcement" : "New Announcement") : "Announcement");
    setHeaderBackAction(
      showNewAnnouncement ? () => closeForm : null,
    );

    return () => {
      setHeaderTitle("");
      setHeaderBackAction(null);
    };
  }, [editingAnnouncement, setHeaderBackAction, setHeaderTitle, showNewAnnouncement]);

  const filteredAnnouncements = announcements.filter((announcement) =>
    `${announcement.title} ${announcement.content}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setAnnouncementsLoading(true);
        setAnnouncementsError(null);
        
        const responseData = await getAnnouncements({ status: filter.toLowerCase() });
        const response = { data: responseData };

        console.log("✅ Announcements fetched successfully:", response.data);
        
        // Transform API data to component format
        const results = response.data?.results || [];
        const transformedAnnouncements = (Array.isArray(results) ? results : []).map((announcement) => {
          const images = announcement.images && announcement.images.length > 0 
            ? announcement.images.map(img => ({
                _id: img._id,
                imgName: img.imgName,
                imgUrl: img.imgUrl || img.imageUrl || img.url
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
            scheduleDateAndTime: announcement.scheduleDateAndTime || announcement.createdAt,
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
  }, [filter]);

  const uploadAnnouncementFiles = async (files) => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      const newFiles = await Promise.all(files.map(async (file) => {
        const uploaded = await uploadMedia(file);
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          imgUrl: uploaded.url,
        };
      }));
      setUploadedFiles((current) => [...current, ...newFiles]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    uploadAnnouncementFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadAnnouncementFiles(Array.from(e.dataTransfer.files));
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
      const images = uploadedFiles.map((file, index) => ({
          imgName: file.name?.split('.')[0] || `image-${index}`,
          imgUrl: file.imgUrl,
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
      const response = editingAnnouncement
        ? { data: await updateAnnouncement(editingAnnouncement.id, payload) }
        : { data: await createAnnouncement(payload) };

      console.log("✅ Announcement published successfully:", response.data);
      toast.success(editingAnnouncement ? "Announcement updated successfully!" : "Announcement published successfully!");
      
      // Reset form
      setFormData({
        title: "",
        message: "",
        scheduleDateAndTime: "",
      });
      setUploadedFiles([]);
      setShowNewAnnouncement(false);
      setEditingAnnouncement(null);

      // Refresh announcements list
      const fetchAnnouncements = async () => {
        try {
          const response = { data: await getAnnouncements({ status: filter.toLowerCase() }) };

          const results = response.data?.results || [];
          const transformedAnnouncements = (Array.isArray(results) ? results : []).map((announcement) => {
            return {
              id: announcement._id || announcement.id,
              title: announcement.title || "Untitled",
              content: announcement.content || announcement.description || "",
              scheduleDateAndTime: announcement.scheduleDateAndTime || announcement.createdAt,
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
                    imgUrl: img.imgUrl || img.imageUrl || img.url
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
                          `Failed to ${editingAnnouncement ? "update" : "publish"} announcement`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.content,
      scheduleDateAndTime: announcement.scheduleDateAndTime || "",
    });
    setUploadedFiles((announcement.images || []).map((image, index) => ({
      id: image._id || `existing-${index}`,
      _id: image._id,
      name: image.imgName || `image-${index + 1}`,
      imgUrl: image.imgUrl,
    })));
    setShowSchedulePicker(false);
    setShowNewAnnouncement(true);
  };

  const handleDelete = async (announcement) => {
    setDeletingId(announcement.id);
    try {
      await deleteAnnouncement(announcement.id);
      setAnnouncements((current) => current.filter((item) => item.id !== announcement.id));
      setAnnouncementToDelete(null);
      toast.success("Announcement deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  if (showNewAnnouncement) {
    return (
      <NewAnnouncementPage>
        <PageHeader>
          <FormHeading>{editingAnnouncement ? "Edit Announcement" : "Announcement"}</FormHeading>
        </PageHeader>

        <ContentWrapper>
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
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </FormGroup>
            </FormRow>

         
          </Section>

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
                <DropIcon src={uploadIcon} alt="" />
                <span>Upload Files</span>
              </DropZoneText>
            </DropZone>

            {uploadedFiles.length > 0 && (
              <UploadedFilesList>
                {uploadedFiles.map(file => (
                  <UploadedFile key={file.id}>
                    {file.imgUrl && (
                      <UploadedImagePreview src={file.imgUrl} alt={file.name} />
                    )}
                    <FileName>{file.name}</FileName>
                    <RemoveButton onClick={() => removeFile(file.id)}>×</RemoveButton>
                  </UploadedFile>
                ))}
              </UploadedFilesList>
            )}
          </Section>

          {showSchedulePicker && (
            <SchedulePanel>
              <ScheduleHeading>Schedule announcement</ScheduleHeading>
              <ScheduleFields>
                <CalenderInput
                  label="Date"
                  labelMargin="0 0 0.625rem 0"
                  initialDate={formData.scheduleDateAndTime || undefined}
                  onDateSelect={updateScheduledDate}
                />
                <TimeInputComponent
                  label="Time"
                  initialTime={formData.scheduleDateAndTime || undefined}
                  onTimeSelect={updateScheduledTime}
                />
              </ScheduleFields>
              {formData.scheduleDateAndTime && (
                <ScheduledValue>
                  Scheduled for {new Date(formData.scheduleDateAndTime).toLocaleString()}
                </ScheduledValue>
              )}
            </SchedulePanel>
          )}

          <Footer>
            <ScheduleButton type="button" onClick={() => setShowSchedulePicker((current) => !current)}>
              {formData.scheduleDateAndTime
                ? `Scheduled: ${new Date(formData.scheduleDateAndTime).toLocaleString()}`
                : "Schedule"}
            </ScheduleButton>
            <ButtonGroup>
              <CancelButton type="button" onClick={closeForm} disabled={isSubmitting}>
                Cancel
              </CancelButton>
              <PublishButton type="button" onClick={handlePublish} disabled={isSubmitting || isUploading}>
                {isUploading ? "Uploading..." : isSubmitting ? (editingAnnouncement ? "Updating..." : "Publishing...") : (editingAnnouncement ? "Update" : "Publish")}
              </PublishButton>
            </ButtonGroup>
          </Footer>
        </ContentWrapper>
      </NewAnnouncementPage>
    );
  }

  return (
    <Container>
      <Toolbar>
        <SearchInputWrapper>
          <SearchInputComponent
            placeholder="Search Announcement"
            value={searchQuery}
            onSearchChange={setSearchQuery}
            width="356px"
            height="40px"
          />
        </SearchInputWrapper>
        <RightActions>
          {isAdmin && (
            <AnnouncementFilter>
              <DropdownComponent
                options={["Published", "Scheduled"]}
                value={filter}
                onChange={setFilter}
                placeholder="Select status"
              />
            </AnnouncementFilter>
          )}
          <Button
            text="New Announcement"
            icon={<FiPlus />}
            color={theme.colors.white}
            fontSize="14px"
            fontWeight="600"
            radius="10px"
            onClick={() => {
              setEditingAnnouncement(null);
              setFormData({ title: "", message: "", scheduleDateAndTime: "" });
              setUploadedFiles([]);
              setShowSchedulePicker(false);
              setShowNewAnnouncement(true);
            }}
          />
        </RightActions>
      </Toolbar>

      <AnnouncementsList>
        {announcementsLoading ? (
          <LoadingMessage>Loading announcements...</LoadingMessage>
        ) : announcementsError ? (
          <ErrorMessage>{announcementsError}</ErrorMessage>
        ) : filteredAnnouncements.length === 0 ? (
          <EmptyMessage>No announcements found</EmptyMessage>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id}>
              <CardHeader>
                <IconWrapper>
                  <IconImage src={megaphoneIcon} alt="announcement" />
                </IconWrapper>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDate>{announcement.date}</CardDate>
                <CardActions>
                  <ActionButton type="button" onClick={() => handleEdit(announcement)} aria-label={`Edit ${announcement.title}`} title="Edit">
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton type="button" $danger onClick={() => setAnnouncementToDelete(announcement)} disabled={deletingId === announcement.id} aria-label={`Delete ${announcement.title}`} title="Delete">
                    <FiTrash2 />
                  </ActionButton>
                </CardActions>
              </CardHeader>
              {announcement.content && <CardContent>{announcement.content}</CardContent>}
              {announcement.hasImage && announcement.images && announcement.images.length > 0 && (
                <CardImages>
                  {announcement.images.map((image, idx) => {
                    const imageKey = image._id || `${announcement.id}-${idx}`;
                    const isExpiredBlob = image.imgUrl?.startsWith("blob:");
                    const hasFailed = failedImages[imageKey];

                    return isExpiredBlob || !image.imgUrl || hasFailed ? (
                      <UnavailableImage key={imageKey}>
                        Image unavailable
                      </UnavailableImage>
                    ) : (
                      <ImagePlaceholder
                        key={imageKey}
                        src={image.imgUrl}
                        alt={image.imgName || `Announcement image ${idx + 1}`}
                        title={image.imgName || `Announcement image ${idx + 1}`}
                        onError={() =>
                          setFailedImages((current) => ({
                            ...current,
                            [imageKey]: true,
                          }))
                        }
                      />
                    );
                  })}
                </CardImages>
              )}
            </AnnouncementCard>
          ))
        )}
      </AnnouncementsList>
      {announcementToDelete && (
        <DeleteModalBackdrop onMouseDown={() => !deletingId && setAnnouncementToDelete(null)}>
          <DeleteModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-announcement-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <DeleteModalIcon><FiTrash2 /></DeleteModalIcon>
            <DeleteModalTitle id="delete-announcement-title">Delete announcement?</DeleteModalTitle>
            <DeleteModalMessage>
              Are you sure you want to delete <strong>{announcementToDelete.title}</strong>? This action cannot be undone.
            </DeleteModalMessage>
            <DeleteModalActions>
              <DeleteModalCancel type="button" onClick={() => setAnnouncementToDelete(null)} disabled={Boolean(deletingId)}>
                Cancel
              </DeleteModalCancel>
              <DeleteModalConfirm type="button" onClick={() => handleDelete(announcementToDelete)} disabled={Boolean(deletingId)} autoFocus>
                {deletingId ? "Deleting..." : "Delete"}
              </DeleteModalConfirm>
            </DeleteModalActions>
          </DeleteModal>
        </DeleteModalBackdrop>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const DeleteModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.48);
`;

const DeleteModal = styled.div`
  width: min(420px, 100%);
  box-sizing: border-box;
  padding: 28px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
  text-align: center;
`;

const DeleteModalIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff1f1;
  color: #dc2626;
  font-size: 22px;
`;

const DeleteModalTitle = styled.h2`
  margin: 0 0 8px;
  color: ${theme.colors.textColor};
  font: 600 20px/1.4 "Inter", sans-serif;
`;

const DeleteModalMessage = styled.p`
  margin: 0 0 24px;
  color: ${theme.colors.secondaryTextColor};
  font: 400 14px/1.6 "Inter", sans-serif;

  strong { color: ${theme.colors.textColor}; }
`;

const DeleteModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const DeleteModalButton = styled.button`
  min-width: 96px;
  padding: 10px 16px;
  border-radius: 6px;
  font: 600 14px/1.4 "Inter", sans-serif;
  cursor: pointer;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const DeleteModalCancel = styled(DeleteModalButton)`
  border: 1px solid #d1d5db;
  background: #fff;
  color: ${theme.colors.textColor};
`;

const DeleteModalConfirm = styled(DeleteModalButton)`
  border: 1px solid #dc2626;
  background: #dc2626;
  color: #fff;

  &:hover:not(:disabled) { background: #b91c1c; }
`;

const NewAnnouncementPage = styled.div`
  min-height: calc(100vh - 110px);
  margin: -20px;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bgColor};
`;

const PageHeader = styled.div`
  min-height: 57px;
  padding: 0 20px;
  display: flex;
  align-items: center;

  h2 {
    margin: 0;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0;
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
  max-width: 356px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const AnnouncementFilter = styled.div`
  width: 183px;
`;

const FilterSelect = styled.select`
  width: 183px;
  padding: 0 12px;
  height: 40px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #066C78;
    box-shadow: 0 0 0 3px rgba(6, 108, 120, 0.1);
  }
`;

const AnnouncementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 540px;
  padding: 0 20px;
  background: white;
  border-radius: 10px;
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
  padding: 20px 0 24px;
  border-bottom: 1px solid #e0e3e6;

  &:last-child {
    border-bottom: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: #edf6f9;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconImage = styled.img`
  width: 28px;
  height: 28px;
`;

const CardTitle = styled.h3`
  flex: 1;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 600;
  color: #0c2427;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CardDate = styled.span`
  font-size: 16px;
  line-height: 1.6;
  color: #0c2427;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  flex-shrink: 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid ${(props) => props.$danger ? "#dc2626" : theme.colors.primary};
  border-radius: 7px;
  background: white;
  color: ${(props) => props.$danger ? "#dc2626" : theme.colors.primary};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${(props) => props.$danger ? "#fee2e2" : "#edf6f9"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CardContent = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #7a7a7a;
  margin: -28px 150px 0 68px;
  line-height: 1.6;
  font-family: "Inter", sans-serif;
`;

const CardImages = styled.div`
  display: flex;
  gap: 0.75rem;
  margin: 16px 0 0 68px;
  flex-wrap: wrap;
`;

const ImagePlaceholder = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 0;
  display: block;
  
  &:not([src]) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const UnavailableImage = styled.div`
  width: 100px;
  height: 100px;
  padding: 8px;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  border: 1px dashed #b1b1b1;
  border-radius: 8px;
  background: #f3f5f9;
  color: #7a7a7a;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
`;

// New Announcement Form Styles
const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bgColor};
`;

const FormHeading = styled.h2`
  margin: 0 0 25px;
  color: ${theme.colors.primary};
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
`;

const Section = styled.div`
  width: min(820px, 100%);
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  margin-bottom: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  color: ${theme.colors.textColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  height: 48px;
  padding: 9px 16px;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
  max-width: 400px;

  &:focus {
    outline: none;
    border-color: #066C78;
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  height: 200px;
  padding: 9px 16px;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  background: white;
  width: 100%;
  box-sizing: border-box;
  resize: none;

  &:focus {
    outline: none;
    border-color: #066C78;
  }

  &::placeholder {
    color: #999;
  }
`;

const DropZone = styled.div`
  height: 110px;
  box-sizing: border-box;
  border: 1px dashed ${theme.colors.primary};
  border-radius: 10px;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(6, 108, 120, ${(props) => props.$isDragging ? 0.16 : 0.1});

  &:hover {
    background: rgba(6, 108, 120, 0.16);
  }
`;

const DropZoneText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  color: ${theme.colors.primary};
`;

const DropIcon = styled.img`
  width: 40px;
  height: 40px;
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

const UploadedImagePreview = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  margin-right: 0.75rem;
`;

const SchedulePanel = styled.div`
  width: min(820px, 100%);
  box-sizing: border-box;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: white;
`;

const ScheduleHeading = styled.h3`
  margin: 0 0 12px;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
`;

const ScheduleFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ScheduledValue = styled.p`
  margin: 12px 0 0;
  color: ${theme.colors.primary};
  font-family: "Inter", sans-serif;
  font-size: 13px;
  font-weight: 600;
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
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto -20px 0;
  padding: 0 20px;
  border-top: 1px solid #e0e3e6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const ScheduleButton = styled.button`
  min-width: 200px;
  max-width: 420px;
  height: 40px;
  padding: 10px 16px;
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  background: white;
  color: ${theme.colors.primary};
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
  }
`;

const CancelButton = styled.button`
  width: 200px;
  height: 40px;
  padding: 10px 16px;
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  background: white;
  color: ${theme.colors.primary};
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 14px;
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
  width: 200px;
  height: 40px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: ${theme.colors.primary};
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #055b65;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Announcement;
