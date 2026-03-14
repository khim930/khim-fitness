import { useState, useEffect, useRef, useCallback } from "react";
import { setSession } from "../utils/helpers";

// ── Detect mobile viewport ─────────────────────────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}

// ── Stopwatch timer ────────────────────────────────────────────────────────
export function useTimer() {
  const [secs, setSecs]       = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => { setSecs(0); setRunning(false); }, []);

  return { secs, running, setRunning, reset };
}

// ── Rest countdown ─────────────────────────────────────────────────────────
export function useRestCountdown() {
  const [restSecs, setRestSecs]   = useState(0);
  const [restRunning, setRestRun] = useState(false);

  useEffect(() => {
    if (!restRunning || restSecs <= 0) return;
    const id = setInterval(() => {
      setRestSecs((s) => {
        if (s <= 1) { setRestRun(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restRunning, restSecs]);

  const startRest = useCallback((seconds) => {
    if (!seconds) return;
    setRestSecs(seconds);
    setRestRun(true);
  }, []);

  return { restSecs, restRunning, startRest };
}

// ── PWA install prompt ─────────────────────────────────────────────────────
export function usePWAInstall() {
  const [prompt, setPrompt]       = useState(null);
  const [showBanner, setBanner]   = useState(false);
  const [isInstalled, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setPrompt(e);
      setBanner(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    window.addEventListener("appinstalled", () => { setInstalled(true); setBanner(false); });
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!prompt) return false;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") { setInstalled(true); setBanner(false); }
    setPrompt(null);
    return outcome === "accepted";
  }, [prompt]);

  return { showBanner, isInstalled, triggerInstall };
}

// ── Tab navigation with back-button support ───────────────────────────────
export function useTabNav(initialTab = "home") {
  const [tab, setTab]       = useState(initialTab);
  const historyRef          = useRef([initialTab]);

  useEffect(() => {
    window.history.replaceState({ tab: initialTab }, "", "");

    const handlePop = () => {
      const hist = historyRef.current;
      if (hist.length > 1) {
        const prev = hist[hist.length - 2];
        historyRef.current = hist.slice(0, -1);
        setTab(prev);
        window.history.pushState({ tab: prev }, "", "");
      } else {
        setTab("home");
        window.history.pushState({ tab: "home" }, "", "");
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigateTo = useCallback((newTab) => {
    setTab((current) => {
      if (current === newTab) return current;
      historyRef.current = [...historyRef.current, newTab];
      window.history.pushState({ tab: newTab }, "", "");
      return newTab;
    });
  }, []);

  return { tab, navigateTo };
}

// ── Toast notifications ────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, color = "#1a6e5a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, showToast };
}
