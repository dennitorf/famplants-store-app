"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UIState } from "@/models/states/ui-state";
import { uiActions } from "@/store/ui-slice";
import Welcome from "./welcome";

const WELCOME_VISIBLE_MS = 5000;
const FADE_DURATION_MS = 500;

interface WelcomeGateProps {
  children: React.ReactNode;
}

export default function WelcomeGate({ children }: WelcomeGateProps) {
  const dispatch = useDispatch();
  const uiState = useSelector((state: { ui: UIState }) => state.ui);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (uiState.hasVisitedWelcomeScreen) {
      return;
    }

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, WELCOME_VISIBLE_MS);

    const doneTimer = window.setTimeout(() => {
      dispatch(uiActions.setHasVisitedWelcomeScreen(true));
    }, WELCOME_VISIBLE_MS + FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [dispatch, uiState.hasVisitedWelcomeScreen]);

  if (!uiState.hasVisitedWelcomeScreen) {
    return (
      <div
        className={`transition-opacity duration-500 ${
          isFadingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <Welcome />
      </div>
    );
  }

  return children;
}
