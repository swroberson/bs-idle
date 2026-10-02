"use client";

import Image from "next/image";
import { useState } from "react";
import { CHRONICLE } from "@/content/chronicle";
import { ILLUSTRATIONS } from "@/content/illustrations";
import type { IllustrationId } from "@/game/types";

export function IllustratedRecord({ id, captionId, eager = false }: {
  id: IllustrationId; captionId?: string; eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const art = ILLUSTRATIONS[id];
  return <figure className="illustrated-record">
    {failed ? <p role="status" className="illustration-unavailable">Illustration unavailable. The written record remains below.</p> :
      <Image src={art.src} alt={art.alt} width={art.width} height={art.height} unoptimized
        loading={eager ? "eager" : "lazy"} className="discovery-image" onError={() => setFailed(true)} />}
    <figcaption id={captionId} className="narrative">{CHRONICLE[art.chronicle].text}</figcaption>
  </figure>;
}
