import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import DetailsSidebar from "./DetailsSidebar";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

const FaceCaptureSidebar = ({ open, onClose }) => {
  const webcamRef = useRef(null);
  const checkingRef = useRef(false);
  const modelsLoadedRef = useRef(false);
  const [status, setStatus] = useState("Camera ready");
  const [embeddingSent, setEmbeddingSent] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    setStatus("Camera ready - click Detect & Send Now");
    modelsLoadedRef.current = false;
  }, [open]);

  const checkFace = async () => {
    if (checkingRef.current) return;
    const video = webcamRef.current?.video;
    if (!video || video.readyState !== 4) return;
    checkingRef.current = true;
    try {
      if (!modelsLoadedRef.current) {
        setStatus("Loading face model...");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        modelsLoadedRef.current = true;
      }
      const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (!result) {
        setStatus("Looking for face...");
        return;
      }
      const embedding = Array.from(result.descriptor);
      setStatus("Face detected - sending embedding...");
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const response = await fetch(`${apiBaseUrl}/v1/face/embedding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding }),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      if (data.matched === false) {
        setEmbeddingSent(false);
        setMatchedPerson(null);
        setStatus(data.message || "No matching person found");
        return;
      }
      setEmbeddingSent(true);
      setMatchedPerson(data.person || null);
      setStatus(data.person?.name ? `Match found: ${data.person.name}` : "Face embedding sent successfully");
    } catch (error) {
      console.error("Face embedding API error:", error);
      setStatus("Face detected - API connection pending");
    } finally {
      checkingRef.current = false;
    }
  };

  return (
    <DetailsSidebar open={open} onClose={onClose} title="Face Capture" variant="full-screen">
      <div style={{ background: "#f4f6f8", borderRadius: 12, overflow: "hidden" }}>
        <Webcam ref={webcamRef} audio={false} mirrored videoConstraints={{ facingMode: "user", width: 640, height: 480 }} style={{ width: "100%", display: "block" }} />
      </div>
      <p
        style={{
          margin: 0,
          color: status === "No matching person found" ? "#dc2626" : "#4ca884",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {status}
      </p>
      {matchedPerson && (
        <div style={{ padding: 12, borderRadius: 8, background: "#e7f5ef" }}>
          <strong>{matchedPerson.name}</strong>
          {matchedPerson.employeeCode && <div>{matchedPerson.employeeCode}</div>}
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0 }}>1. Face detected</p>
        <p style={{ margin: 0 }}>2. Face embedding {embeddingSent ? "sent" : "pending"}</p>
      </div>
      <button
        type="button"
        onClick={checkFace}
        style={{
          border: 0,
          borderRadius: 8,
          padding: "12px 18px",
          background: "#4ca884",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Detect & Send Now
      </button>
    </DetailsSidebar>
  );
};

export default FaceCaptureSidebar;
