import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import DetailsSidebar from "./DetailsSidebar";

const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
const EMBEDDING_SAMPLE_COUNT = 5;
const EMBEDDING_SAMPLE_DELAY_MS = 250;
const CAMERA_STABILIZATION_MS = 1000;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const averageAndNormalizeDescriptors = (descriptors) => {
  const length = descriptors[0].length;
  const averaged = Array.from({ length }, (_, index) => (
    descriptors.reduce((sum, descriptor) => sum + descriptor[index], 0) / descriptors.length
  ));
  const magnitude = Math.sqrt(averaged.reduce((sum, value) => sum + value * value, 0));
  return averaged.map((value) => value / (magnitude || 1));
};

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
      setStatus("Hold still - focusing on your face...");
      await wait(CAMERA_STABILIZATION_MS);

      const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.6 });
      const descriptors = [];
      for (let sample = 0; sample < EMBEDDING_SAMPLE_COUNT; sample += 1) {
        const faces = await faceapi
          .detectAllFaces(video, detectorOptions)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (faces.length === 0) {
          setStatus("Face lost - keep exactly one face in view");
          return;
        }
        if (faces.length > 1) {
          setEmbeddingSent(false);
          setMatchedPerson(null);
          setStatus("Only one person should be in the camera");
          return;
        }
        descriptors.push(faces[0].descriptor);
        if (sample < EMBEDDING_SAMPLE_COUNT - 1) await wait(EMBEDDING_SAMPLE_DELAY_MS);
      }

      const embedding = averageAndNormalizeDescriptors(descriptors);
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
