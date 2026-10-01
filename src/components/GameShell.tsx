"use client";

import { useEffect, useState } from "react";
import { BALANCE } from "@/content/balance";
import { CHRONICLE } from "@/content/chronicle";
import { RESOURCES } from "@/content/resources";
import { gatheringWaitMs } from "@/game/actions";
import type { ResourceId } from "@/game/types";
import { buttonClass, SavePanel } from "./SavePanel";
import { useLocalGame } from "./useLocalGame";

const sections = { ward: "Ward", chronicle: "Chronicle", settings: "Save & settings" } as const;

export function GameShell() {
  const game = useLocalGame();
  const [section, setSection] = useState<keyof typeof sections>("ward");
  const [now, setNow] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(() => {
        setOfflineStatus("Offline shell ready");
      }).catch(() => { setOfflineStatus("Offline shell unavailable — revisit while online"); });
    }
    return () => window.clearInterval(interval);
  }, []);

  const wait = game.state && now > 0 ? gatheringWaitMs(game.state, now) : 0;
  const recovery = game.status === "error" && !game.state;

  return <div className="mx-auto min-h-dvh max-w-5xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-10">
    <a href="#main" className="absolute -top-20 left-5 z-10 bg-lamp px-4 py-3 text-ward focus:top-4">Skip to content</a>
    <header className="flex items-center justify-between gap-4 border-b border-line py-7 sm:py-10">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-lamp">The Outer Ward · Phase I</p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Buried Sun</h1>
      </div>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 shrink-0 text-lamp" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 28h20l-2 19H24zM22 52h20M32 47v5M25 28v-6a7 7 0 0 1 14 0v6M32 43c-5-4-4-7 0-11 4 4 5 7 0 11zM32 6v4M12 16l4 3M52 16l-4 3" />
      </svg>
    </header>

    {game.state && <section aria-label="Ward stores" className="grid grid-cols-3 divide-x divide-line border-b border-line py-5 sm:py-7">
      {(Object.keys(RESOURCES) as ResourceId[]).map((id) => <div key={id} className="px-3 first:pl-0 sm:px-6">
        <p className="text-xs uppercase tracking-wider text-muted">{RESOURCES[id].name}</p>
        <p className="mt-2 font-serif text-3xl tabular-nums">{game.state!.resources[id].toLocaleString("en-US")}</p>
        <p className="mt-1 text-xs text-muted">In store</p>
      </div>)}
    </section>}

    <nav aria-label="Keeper’s records" className="flex gap-1 border-b border-line py-2 sm:gap-3">
      {(Object.keys(sections) as (keyof typeof sections)[]).map((id) => <button key={id} aria-current={section === id ? "page" : undefined} onClick={() => setSection(id)} className={`min-h-12 border-b-2 px-3 py-3 text-sm sm:px-4 ${section === id ? "border-lamp text-lamp" : "border-transparent text-muted hover:text-ink"}`}>{sections[id]}</button>)}
    </nav>

    <main id="main" tabIndex={-1} className="py-8 sm:py-10">
      {game.error && <p role="alert" className="mb-6 border-l-2 border-lamp bg-panel p-4 text-sm leading-relaxed">{game.error}</p>}
      {game.status === "loading" && <p role="status" className="font-serif text-xl text-muted">Opening the Keeper’s register…</p>}
      {game.status === "waiting" && <div role="status" className="space-y-3"><h2 className="font-serif text-2xl">The register is open elsewhere.</h2><p className="leading-relaxed text-muted">Close the other Buried Sun tab to continue here. This tab will then load your latest progress.</p></div>}
      {(section === "settings" || recovery) && game.status !== "loading" && <SavePanel state={game.state} damagedSave={game.damagedSave} disabled={game.status === "waiting"} importSave={game.importSave} reset={game.reset} />}
      {game.state && !recovery && section === "ward" && <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
        <section aria-labelledby="ward-heading">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">The Keeper’s first obligation</p>
          <h2 id="ward-heading" className="font-serif text-3xl sm:text-4xl">Keep the lamps burning.</h2>
          <p className="mt-5 font-serif text-lg leading-relaxed text-ink">Beyond the last inhabited street, the road climbs toward the Citadel. At dusk, its windows disappear. The lamps of the Ward must not.</p>
          <div className="mt-7 border-l-2 border-lamp bg-panel p-5">
            <h3 className="font-serif text-xl">Begin with provisions</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">There is still food growing among the abandoned gardens. Bring a little back for the five who remain.</p>
            <button className={`${buttonClass} mt-5 w-full border-lamp bg-lamp text-ward hover:bg-ink sm:w-auto`} disabled={game.status !== "active" || wait > 0} onClick={() => game.dispatch({ type: "gather-food" })}>Gather provisions · +{BALANCE.gatheringFood} Food</button>
            <p role="status" className="mt-3 text-xs text-muted">{wait > 0 ? `Gather again in ${Math.ceil(wait / 1000)} seconds.` : "A small recovery action. Available once every 30 seconds."}</p>
          </div>
        </section>
        <aside aria-labelledby="inhabitants-heading" className="border-t border-line pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
          <h2 id="inhabitants-heading" className="font-serif text-2xl">Those who remain</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Inhabitants</dt><dd>{game.state.population}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Assigned to work</dt><dd>0</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Available</dt><dd>{game.state.population}</dd></div>
          </dl>
          <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">The register has room for more names. For now, there are five.</p>
        </aside>
      </div>}
      {game.state && section === "chronicle" && <section aria-labelledby="chronicle-heading">
        <h2 id="chronicle-heading" className="font-serif text-3xl">The Ward’s chronicle</h2>
        {game.state.chronicle.map((id) => <article key={id} className="mt-6 max-w-2xl border-l border-line pl-5">
          <p className="text-xs uppercase tracking-wider text-lamp">First entry</p>
          <h3 className="mt-3 font-serif text-2xl">{CHRONICLE[id].title}</h3>
          <p className="mt-4 font-serif text-lg leading-relaxed">{CHRONICLE[id].text}</p>
        </article>)}
      </section>}
    </main>
    <footer className="space-y-2 border-t border-line py-5 text-xs leading-relaxed text-muted">
      <p>Foundation build · The economy and story progression are still to come. Stores do not yet change while you are away.</p>
      <p>{game.status === "active" ? "Saved in this browser" : "Local records"}{offlineStatus && ` · ${offlineStatus}`}</p>
    </footer>
  </div>;
}
