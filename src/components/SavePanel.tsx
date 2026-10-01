"use client";

import { useState } from "react";
import { encodeSave, MAX_SAVE_LENGTH } from "@/game/save";
import type { GameState } from "@/game/types";

export const buttonClass = "min-h-12 rounded-sm border border-line px-4 py-3 text-sm font-medium hover:bg-line focus-visible:outline-lamp";

export function SavePanel({ state, damagedSave, disabled, importSave, reset }: {
  state: GameState | null;
  damagedSave: string;
  disabled: boolean;
  importSave: (text: string) => void;
  reset: () => void;
}) {
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const exportText = state ? encodeSave(state) : damagedSave;

  function importBackup(text: string) {
    try { importSave(text); setMessage("Save imported. Your Ward is ready."); setImportText(""); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Import failed. Your existing save is preserved."); }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([exportText], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = state ? "buried-sun-save.json" : "buried-sun-damaged-save.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  return <section aria-labelledby="save-heading" className="space-y-6">
    <div>
      <h2 id="save-heading" className="font-serif text-3xl">The Keeper’s records</h2>
      <p className="mt-3 leading-relaxed text-muted">Progress belongs to this browser. Keep a copy to carry your Ward to another device.</p>
    </div>
    {exportText && <div className="space-y-3">
      <label htmlFor="backup" className="block text-sm font-medium">{state ? "Your save backup" : "Original stored text — preserved for recovery"}</label>
      <textarea id="backup" readOnly value={exportText} rows={5} className="w-full rounded-sm border border-line bg-ward p-3 font-mono text-xs" />
      <div className="flex flex-wrap gap-3">
        <button className={buttonClass} onClick={download}>Download backup</button>
        <button className={buttonClass} onClick={async () => {
          try { await navigator.clipboard.writeText(exportText); setMessage("Backup copied."); }
          catch { setMessage("Select the backup text above and copy it using your device’s copy controls."); }
        }}>Copy backup text</button>
      </div>
    </div>}
    <div className="space-y-3 border-t border-line pt-6">
      <label htmlFor="import-text" className="block text-sm font-medium">Paste a save to import</label>
      <textarea id="import-text" value={importText} onChange={(event) => setImportText(event.target.value)} maxLength={MAX_SAVE_LENGTH} rows={4} disabled={disabled} className="w-full rounded-sm border border-line bg-ward p-3 font-mono text-xs" />
      <button className={buttonClass} disabled={disabled || !importText.trim()} onClick={() => importBackup(importText)}>Import pasted save</button>
      <label htmlFor="import-file" className="block pt-2 text-sm font-medium">Or choose a JSON save file</label>
      <input id="import-file" type="file" accept=".json,application/json" disabled={disabled} className="block min-h-12 w-full text-sm file:mr-3 file:rounded-sm file:border file:border-line file:bg-panel file:px-4 file:py-3 file:text-ink" onChange={async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (file.size > MAX_SAVE_LENGTH) { setMessage("This file is too large for this save version."); return; }
        try { importBackup(await file.text()); }
        catch { setMessage("This file could not be read. Your existing save is preserved."); }
      }} />
    </div>
    <div className="border-t border-line pt-6">
      <p className="mb-3 text-sm text-muted">Starting again replaces this browser’s save. Export a backup first if you want to keep it.</p>
      <button className={buttonClass} disabled={disabled} onClick={() => {
        if (!window.confirm("Replace this browser’s Buried Sun save and start again? This cannot be undone without a backup.")) return;
        try { reset(); setMessage("A new Keeper’s record has begun."); }
        catch (cause) { setMessage(cause instanceof Error ? cause.message : "Reset failed."); }
      }}>Start again…</button>
    </div>
    <p role="status" className="text-sm leading-relaxed text-lamp">{message}</p>
  </section>;
}
