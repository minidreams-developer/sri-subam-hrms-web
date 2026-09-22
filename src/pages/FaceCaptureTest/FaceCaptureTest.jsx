import { useState } from "react";
import FaceCaptureSidebar from "../../components/FaceCaptureSidebar";

const FaceCaptureTest = () => {
  const [open, setOpen] = useState(true);

  return (
    <FaceCaptureSidebar open={open} onClose={() => setOpen(false)} />
  );
};

export default FaceCaptureTest;
