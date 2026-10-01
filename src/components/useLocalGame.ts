"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { applyAction } from "@/game/actions";
import { decodeSave, encodeSave, SAVE_KEY } from "@/game/save";
import { createInitialState } from "@/game/state";
import type { GameAction, GameState } from "@/game/types";
import type { ReturnSummary } from "@/game/types";
import { BALANCE } from "@/content/balance";
import { reconcile } from "@/game/simulation";

export function useLocalGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [status, setStatus] = useState<"loading" | "waiting" | "active" | "error">("loading");
  const [error, setError] = useState("");
  const [damagedSave, setDamagedSave] = useState("");
  const [returnSummary, setReturnSummary] = useState<ReturnSummary | null>(null);
  const current = useRef<GameState | null>(null);
  const ownsLock = useRef(false);

  const commit = useCallback((next: GameState, persist = true) => {
    if (!ownsLock.current) throw new Error("Another tab owns this Ward. Close it before changing this save.");
    try { if (persist) localStorage.setItem(SAVE_KEY, encodeSave(next)); }
    catch { throw new Error("Browser storage is unavailable or full. Export a backup before closing this page."); }
    current.current = next;
    setState(next);
    setStatus("active");
    if (persist) { setError(""); setDamagedSave(""); }
  }, []);

  const advance = useCallback((persist: boolean) => {
    if (!current.current || !ownsLock.current) return;
    const result = reconcile(current.current, Date.now());
    if (result.summary.elapsedMs >= BALANCE.returnSummaryAfterMs) setReturnSummary(result.summary);
    if (result.state !== current.current || persist) commit(result.state, persist);
  }, [commit]);

  useEffect(() => {
    let stopped = false;
    let release = () => {};
    const controller = new AbortController();

    // The lock lives as long as this page. Waiting tabs reload storage only after
    // ownership transfers, so they can never overwrite a newer active save.
    void Promise.resolve().then(async () => {
      if (stopped) return;
      if (!navigator.locks) {
        setStatus("error");
        setError("This browser cannot safely lock a save. Open the game in a current Safari, Chrome, Firefox or Edge browser.");
        return;
      }
      setStatus("waiting");
      await navigator.locks.request("buried-sun.active-tab", { signal: controller.signal }, async () => {
        if (stopped) return;
        ownsLock.current = true;
        try {
          const stored = localStorage.getItem(SAVE_KEY);
          if (stored !== null) setDamagedSave(stored);
          const now = Date.now();
          const result = reconcile(stored === null ? createInitialState(now) : decodeSave(stored, now), now);
          commit(result.state);
          if (result.summary.elapsedMs >= BALANCE.returnSummaryAfterMs) setReturnSummary(result.summary);
        } catch (cause) {
          setStatus("error");
          setError(cause instanceof Error ? cause.message : "The stored save could not be loaded.");
        }

        const save = () => {
          if (!current.current || !ownsLock.current) return;
          try { localStorage.setItem(SAVE_KEY, encodeSave(current.current)); }
          catch { setError("The latest progress could not be saved. Export a backup before closing this page."); }
        };
        const tick = () => {
          if (document.visibilityState !== "visible") return;
          try { advance(false); } catch (cause) { setError(cause instanceof Error ? cause.message : "Production could not be updated."); }
        };
        const onVisibility = () => {
          try { advance(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "Progress could not be saved."); }
        };
        const onPageHide = () => { if (document.visibilityState === "visible") onVisibility(); else save(); };
        const interval = window.setInterval(() => { if (document.visibilityState === "visible") save(); }, 15_000);
        const ticks = window.setInterval(tick, 1000);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("pagehide", onPageHide);
        await new Promise<void>((resolve) => { release = resolve; });
        window.clearInterval(interval);
        window.clearInterval(ticks);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onPageHide);
        ownsLock.current = false;
      });
    }).catch((cause: unknown) => {
      if (!stopped) {
        setStatus("error");
        setError(cause instanceof Error ? cause.message : "Save ownership could not be established.");
      }
    });
    return () => { stopped = true; controller.abort(); release(); };
  }, [advance, commit]);

  const dispatch = (action: GameAction) => {
    if (!current.current || status !== "active") return;
    try { advance(false); commit(applyAction(current.current!, action, Date.now())); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Progress could not be saved."); }
  };

  return {
    state, status, error, damagedSave, dispatch, returnSummary,
    dismissSummary: () => setReturnSummary(null),
    importSave: (text: string) => {
      const now = Date.now();
      const result = reconcile(decodeSave(text, now), now);
      commit(result.state);
      setReturnSummary(result.summary.elapsedMs >= BALANCE.returnSummaryAfterMs ? result.summary : null);
    },
    reset: () => { commit(createInitialState(Date.now())); setReturnSummary(null); },
  };
}
