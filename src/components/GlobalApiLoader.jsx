import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { subscribeApiLoading } from "../helpers/api_helper";
import theme from "../theme/theme";

const SHOW_DELAY_MS = 150;

const GlobalApiLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => subscribeApiLoading(setIsLoading), []);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setIsVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <Overlay role="status" aria-live="polite" aria-label="Loading">
      <LoaderCard>
        <Spinner aria-hidden="true" />
        <LoadingText>Loading...</LoadingText>
      </LoaderCard>
    </Overlay>
  );
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: center;
  background: rgba(12, 36, 39, 0.18);
  backdrop-filter: blur(1px);
`;

const LoaderCard = styled.div`
  min-width: 8.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  background: ${theme.colors.white};
  box-shadow: 0 0.75rem 2rem rgba(12, 36, 39, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const Spinner = styled.span`
  width: 2.25rem;
  height: 2.25rem;
  border: 0.225rem solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const LoadingText = styled.span`
  color: ${theme.colors.textColor};
  font: 600 0.875rem "Inter-SemiBold", sans-serif;
`;

export default GlobalApiLoader;
