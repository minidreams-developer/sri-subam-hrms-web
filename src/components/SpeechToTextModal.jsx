import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import OkIcon from "../assets/images/Customer/ok.svg";
import CancelIcon from "../assets/images/Customer/cancel.svg";

const SpeechToTextModal = ({ isOpen, onClose, onTranscript }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const barsRef = useRef([]);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioRef.current = { stream, audioCtx };
      analyserRef.current = analyser;
      animateBars();
    } catch (err) {
      console.error("Microphone access failed", err);
    }
  };

  const stopAudio = () => {
    try {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const audioObj = audioRef.current;
      if (audioObj?.stream) {
        audioObj.stream.getTracks().forEach((t) => t.stop());
      }
      if (audioObj?.audioCtx && audioObj.audioCtx.state !== "closed") {
        audioObj.audioCtx.close();
      }
    } catch {}
    audioRef.current = null;
    analyserRef.current = null;
  };

  const animateBars = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const tick = () => {
      if (!analyserRef.current) return;
      analyser.getByteFrequencyData(dataArray);

      barsRef.current.forEach((el, i) => {
        if (!el) return;

        // Focus on the speech frequency range (lower bins)
        // Map 24 bars to the first ~40 bins roughly
        const start = Math.floor(i * 1.5);
        const end = start + 2;
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += dataArray[j] || 0;
        }
        const avg = sum / (end - start);

        // Initial state: Even height (flat line)
        const baseHeight = 6;

        // Transform when sound is heard
        // Boost sensitivity: (avg / 255) * max_additional_height
        const audioHeight = (avg / 255) * 35;

        const totalHeight = Math.min(28, baseHeight + audioHeight);

        el.style.height = `${totalHeight}px`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (isOpen) {
      startAudio();
      SpeechRecognition.startListening({ continuous: true, language: "ta-IN" });
    } else {
      stopAudio();
      SpeechRecognition.stopListening();
      resetTranscript();
    }
    return () => {
      stopAudio();
      SpeechRecognition.stopListening();
    };
  }, [isOpen]);

  const handleOk = () => {
    onTranscript(transcript);
    resetTranscript();
    onClose();
  };

  const handleCancel = () => {
    resetTranscript();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <SpeechPopover>
      <Pointer />
      <BarsRow>
        {Array.from({ length: 24 }).map((_, i) => (
          <Bar
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            style={{ height: "8px" }}
          />
        ))}
      </BarsRow>
      <SpeakText>இப்போது பேசவும்</SpeakText>
      <ActionsRow>
        <CircleButton $ok onClick={handleOk} aria-label="OK">
          <img src={OkIcon} alt="ok" />
        </CircleButton>
        <CircleButton $cancel onClick={handleCancel} aria-label="Cancel">
          <img src={CancelIcon} alt="cancel" />
        </CircleButton>
      </ActionsRow>
    </SpeechPopover>
  );
};

const SpeechPopover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #eaecf0;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
  border-radius: 10px;
  padding: 12px 14px 14px 14px;
  z-index: 1000;
  min-width: 180px;
`;

const Pointer = styled.div`
  position: absolute;
  top: -8px;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #ffffff;
  filter: drop-shadow(0 -1px 0 #eaecf0);
`;

const BarsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 28px;
  margin-bottom: 8px;
`;

const Bar = styled.div`
  width: 4px;
  border-radius: 2px;
  background: #cfd8dc;
  transition: height 0.1s ease-out;
`;

const SpeakText = styled.div`
  font-size: 0.9rem;
  color: #333333;
  margin: 4px 0 10px 0;
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
`;

const CircleButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$ok ? "#77B255" : p.$cancel ? "#B25555" : "#eee")};

  img {
    width: 20px;
    height: 20px;
  }
`;

export default SpeechToTextModal;
