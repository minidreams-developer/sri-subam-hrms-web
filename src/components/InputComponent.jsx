import React, { useState } from "react";
import theme from "../theme/theme";
import styled from "styled-components";
import MicSvg from "../assets/images/Dashboard Images/Group.svg";
import SpeechToTextModal from "./SpeechToTextModal";

const InputComponent = ({
  label = "",
  multiline = false,
  placeholder = "Enter",
  width = "100%",
  showMic = false,
  ...rest
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleMicOpen = () => {
    setShowModal(true);
  };

  const handleTranscript = (text) => {
    if (rest?.onChange && rest?.name) {
      rest.onChange({
        target: { name: rest.name, value: text || "" },
      });
    }
    setShowModal(false);
  };

  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <InputWrapper width={width} $showmic={showMic}>
        {multiline ? (
          <Textarea placeholder={placeholder} {...rest} $showmic={showMic} />
        ) : (
          <Input placeholder={placeholder} {...rest} $showmic={showMic} />
        )}
        {showMic && (
          <MicButton type="button" onClick={handleMicOpen}>
            <img src={MicSvg} alt="mic" />
          </MicButton>
        )}
        {showMic && (
          <SpeechToTextModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onTranscript={handleTranscript}
          />
        )}
      </InputWrapper>
    </FieldWrapper>
  );
};

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", "Noto Sans Tamil", "Tamil Sangam MN",
    "Latha", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: #0c0c0c;
  margin: 1rem 0 0.625rem 0;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  max-width: ${(props) => props.width};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  position: relative;

  &:focus-within {
    border: 2px solid ${theme.colors.primary};
  }

  transition: border 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem ${(props) => (props.$showmic ? "2.5rem" : "0.875rem")}
    0.875rem 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;

  ::placeholder {
    font-family: "Metropolis-Medium", sans-serif;
    opacity: 1;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", "Noto Sans Tamil", "Tamil Sangam MN",
    "Latha", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem ${(props) => (props.$showmic ? "2.5rem" : "0.875rem")}
    0.875rem 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;
  resize: vertical;
  min-height: 5rem;

  ::placeholder {
    font-family: "Metropolis-Medium", "Noto Sans Tamil", "Tamil Sangam MN",
      "Latha", sans-serif;
    opacity: 1;
  }
`;

const MicButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

export default InputComponent;
