"use client";

import { useState } from "react";
import { encodeSave, MAX_SAVE_LENGTH } from "@/game/save";
import type { GameState } from "@/game/types";

const operations = { export: "Export", import: "Import", reset: "Replace" } as const;

export function SavePanel({ state, damagedSave, disabled, importSave, reset }: {
  state: GameState | null;
  damagedSave: string;
  disabled: boolean;
  importSave: (text: string) => void;
  reset: () => void;
}) {
  const [operation, setOperation] = useState<keyof typeof operations>("export");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const exportText = state ? encodeSave(state) : damagedSave;

  function importBackup(text: string) {
    try { importSave(text); setMessage("Record imported."); setImportText(""); }
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

  return <section aria-labelledby="save-heading" className="save-panel">
    <div className="region-heading"><h2 id="save-heading" className="machine-label">Records / Maintenance</h2><span className="machine-label">Storage / local</span></div>
    <div className="module-selector" aria-label="Record operations">
      {(Object.keys(operations) as (keyof typeof operations)[]).map((id) => <button key={id} aria-pressed={operation === id} aria-controls="record-operation" onClick={() => { setOperation(id); setMessage(""); }}>{operations[id]}</button>)}
    </div>
    <div id="record-operation" className="save-operation">
      {operation === "export" && <section className="save-region" aria-labelledby="export-heading">
        <h3 id="export-heading" className="section-title">The Keeper’s record</h3>
        <p className="save-description">Progress is held in this browser. A backup can be carried to another device.</p>
        {exportText ? <>
          <label htmlFor="backup" className="machine-label">{state ? "Backup / JSON" : "Original stored text / recovery"}</label>
          <textarea id="backup" readOnly value={exportText} rows={4} spellCheck={false} />
          <div className="save-controls">
            <button className="machine-button" onClick={download}>Download</button>
            <button className="machine-button" onClick={async () => {
              try { await navigator.clipboard.writeText(exportText); setMessage("Backup copied."); }
              catch { setMessage("Select the backup text and use your device’s copy controls."); }
            }}>Copy text</button>
          </div>
        </> : <p className="save-description">Record unavailable.</p>}
      </section>}
      {operation === "import" && <section className="save-region import-region" aria-labelledby="import-heading">
        <h3 id="import-heading" className="section-title">Import record</h3>
        <label htmlFor="import-text" className="machine-label">Save text / JSON</label>
        <textarea id="import-text" value={importText} onChange={(event) => setImportText(event.target.value)} maxLength={MAX_SAVE_LENGTH} rows={4} disabled={disabled} spellCheck={false} />
        <div className="save-controls"><button className="machine-button" disabled={disabled || !importText.trim()} onClick={() => importBackup(importText)}>Import text</button></div>
        <label htmlFor="import-file" className="machine-label save-file-label">Or / JSON file</label>
        <input id="import-file" type="file" accept=".json,application/json" disabled={disabled} className="save-file" onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          if (file.size > MAX_SAVE_LENGTH) { setMessage("This file is too large for this save version."); return; }
          try { importBackup(await file.text()); }
          catch { setMessage("This file could not be read. Your existing save is preserved."); }
        }} />
      </section>}
      {operation === "reset" && <section className="save-region reset-region" aria-labelledby="reset-heading">
        <h3 id="reset-heading" className="section-title">Replace record</h3>
        <p className="save-description">Starting again replaces this browser’s save. A backup is required to recover it.</p>
        <button className="machine-button danger-control" disabled={disabled} onClick={() => {
          if (!window.confirm("Replace this browser’s Buried Sun save and start again? This cannot be undone without a backup.")) return;
          try { reset(); setMessage("A new Keeper’s record has begun."); }
          catch (cause) { setMessage(cause instanceof Error ? cause.message : "Reset failed."); }
        }}>Start again…</button>
        <p className="build-note machine-label">Production // Up to eight hours while away. Expedition timers continue.</p>
      </section>}
    </div>
    <p role="status" className="save-message">{message}</p>
  </section>;
}
