"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export function CatalogSelect({ labels, index, select, name }: {
  labels: string[]; index: number; select: (index: number) => void; name: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(index);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef({ text: "", at: 0 });
  const listId = `${name}-options`;
  const focused = Math.min(highlighted, labels.length - 1);

  useLayoutEffect(() => {
    if (!open) return;
    // The menu sits outside the scrolling terminal so it cannot be clipped.
    const position = () => {
      const trigger = triggerRef.current;
      const list = listRef.current;
      if (!trigger || !list) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 288), window.innerWidth - 32);
      list.style.width = `${width}px`;
      const desired = Math.min(256, list.scrollHeight);
      const region = trigger.closest("#main")?.getBoundingClientRect();
      const below = Math.min(window.innerHeight - 16, region?.bottom ?? window.innerHeight - 16) - rect.bottom - 4;
      const above = rect.top - Math.max(16, region?.top ?? 16) - 4;
      const upwards = below < desired && above > below;
      const height = Math.max(44, Math.min(desired, upwards ? above : below));
      list.style.maxHeight = `${height}px`;
      list.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))}px`;
      list.style.top = `${upwards ? rect.top - height - 4 : rect.bottom + 4}px`;
    };
    position();
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && listRef.current?.contains(event.target)) return;
      position();
    };
    window.addEventListener("resize", position);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", position);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open, labels.length]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[focused]?.scrollIntoView({ block: "nearest" });
  }, [open, focused]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !triggerRef.current?.contains(event.target) && !listRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function choose(value: number) {
    select(value);
    searchRef.current = { text: "", at: 0 };
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    if (event.ctrlKey || event.metaKey) return;
    if (key === "Escape") {
      if (open) event.preventDefault();
      searchRef.current = { text: "", at: 0 };
      setOpen(false);
    } else if (key === "Tab") {
      if (open) choose(focused);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (open) choose(focused);
      else { setHighlighted(index); setOpen(true); }
    } else if (["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(key)) {
      event.preventDefault();
      if (open && event.altKey && key === "ArrowUp") { choose(focused); return; }
      const next = key === "Home" ? 0 : key === "End" ? labels.length - 1 : !open ? index : focused + (key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : key === "PageDown" ? 10 : -10);
      setHighlighted(Math.max(0, Math.min(labels.length - 1, next)));
      setOpen(true);
    } else if (key.length === 1 && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - searchRef.current.at < 700 ? searchRef.current.text : "";
      const text = previous === key.toLowerCase() ? previous : previous + key.toLowerCase();
      searchRef.current = { text, at: now };
      const start = text.length === 1 ? (open ? focused : index) + 1 : 0;
      for (let offset = 0; offset < labels.length; offset++) {
        const next = (start + offset) % labels.length;
        if (labels[next].toLowerCase().startsWith(text)) { setHighlighted(next); break; }
      }
      if (!open) { setOpen(true); }
    }
  }

  return <>
    <button ref={triggerRef} id={`${name}-page`} className="catalog-select" role="combobox" aria-label={`${name} entry`} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open ? `${listId}-${focused}` : undefined}
      onKeyDown={onKeyDown} onBlur={event => {
        if (open && event.relatedTarget instanceof Node && !listRef.current?.contains(event.relatedTarget)) choose(focused);
      }} onClick={() => { setHighlighted(index); searchRef.current = { text: "", at: 0 }; setOpen(!open); }}>
      <span>{labels[index]}</span><span className="catalog-select-mark" aria-hidden="true">{open ? "−" : "⌄"}</span>
    </button>
    {open && createPortal(<div ref={listRef} id={listId} className="catalog-options" role="listbox" aria-label={`${name} entries`} onMouseDown={event => event.preventDefault()}>
      {labels.map((label, i) => <div key={label} id={`${listId}-${i}`} role="option" aria-selected={focused === i} className={`catalog-option${focused === i ? " is-focused" : ""}`}
        onClick={() => { choose(i); triggerRef.current?.focus({ preventScroll: true }); }}>
        <span aria-hidden="true" className="catalog-option-mark">{index === i ? "▪" : ""}</span><span>{label}</span>
      </div>)}
    </div>, document.body)}
  </>;
}
