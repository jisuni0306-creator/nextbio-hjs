"use client";

import { useCallback, useEffect, useState } from "react";
import { SAMPLE_PARTNERS, type Partner } from "./partners";

const KEY = "partners-v1";

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>(SAMPLE_PARTNERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setPartners(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(partners));
    } catch {
      /* ignore */
    }
  }, [partners, hydrated]);

  const upsert = useCallback((p: Partner) => {
    setPartners((prev) => {
      const i = prev.findIndex((x) => x.code === p.code);
      if (i === -1) return [...prev, p];
      const next = [...prev];
      next[i] = p;
      return next;
    });
  }, []);

  const remove = useCallback((code: string) => {
    setPartners((prev) => prev.filter((x) => x.code !== code));
  }, []);

  const reset = useCallback(() => setPartners(SAMPLE_PARTNERS), []);

  return { partners, hydrated, upsert, remove, reset, setPartners };
}
