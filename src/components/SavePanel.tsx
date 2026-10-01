"use client";

import { useState } from "react";
import { encodeSave, MAX_SAVE_LENGTH } from "@/game/save";
import type { GameState } from "@/game/types";

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

  return <section aria-labelledby="save-heading">
    <div className="region-heading"><span className="machine-label">Record maintenance</span><span className="machine-label">Storage / local</span></div>
    <div className="save-intro">
      <h2 id="save-heading" className="section-title">The Keeper’s records</h2>
      <p>Progress belongs to this browser. Keep a copy to carry your Ward to another device.</p>
    </div>
    {exportText && <section className="save-region" aria-labelledby="export-heading">
      <h3 id="export-heading" className="machine-label">01 / Export record</h3>
      <label htmlFor="backup" className="machine-label">{state ? "Your save backup" : "Original stored text — preserved for recovery"}</label>
      <textarea id="backup" readOnly value={exportText} rows={5} spellCheck={false} />
      <div className="save-controls">
        <button className="machine-button" onClick={download}>Download backup</button>
        <button className="machine-button" onClick={async () => {
          try { await navigator.clipboard.writeText(exportText); setMessage("Backup copied."); }
          catch { setMessage("Select the backup text above and copy it using your device’s copy controls."); }
        }}>Copy backup text</button>
      </div>
    </section>}
    <section className="save-region" aria-labelledby="import-heading">
      <h3 id="import-heading" className="machine-label">02 / Import record</h3>
      <label htmlFor="import-text" className="machine-label">Paste a save to import</label>
      <textarea id="import-text" value={importText} onChange={(event) => setImportText(event.target.value)} maxLength={MAX_SAVE_LENGTH} rows={4} disabled={disabled} spellCheck={false} />
      <div className="save-controls"><button className="machine-button" disabled={disabled || !importText.trim()} onClick={() => importBackup(importText)}>Import pasted save</button></div>
      <label htmlFor="import-file" className="machine-label save-file-label">Or choose a JSON save file</label>
      <input id="import-file" type="file" accept=".json,application/json" disabled={disabled} className="save-file" onChange={async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (file.size > MAX_SAVE_LENGTH) { setMessage("This file is too large for this save version."); return; }
        try { importBackup(await file.text()); }
        catch { setMessage("This file could not be read. Your existing save is preserved."); }
      }} />
    </section>
    <section className="save-region reset-region" aria-labelledby="reset-heading">
      <h3 id="reset-heading" className="machine-label">03 / Replace record</h3>
      <p>Starting again replaces this browser’s save. Export a backup first if you want to keep it.</p>
      <button className="machine-button danger-control" disabled={disabled} onClick={() => {
        if (!window.confirm("Replace this browser’s Buried Sun save and start again? This cannot be undone without a backup.")) return;
        try { reset(); setMessage("A new Keeper’s record has begun."); }
        catch (cause) { setMessage(cause instanceof Error ? cause.message : "Reset failed."); }
      }}>Start again…</button>
    </section>
    <p role="status" className="save-message">{message}</p>
  </section>;
}
