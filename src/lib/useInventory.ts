"use client";

import { useCallback, useEffect, useState } from "react";
import { SAMPLE_ITEMS, type Item } from "./inventory";

const KEY = "inventory-items-v3";

// 재고 데이터를 localStorage에 보관하고 적정재고/자동발주 페이지가 함께 바라보게 함.
export function useInventory() {
  const [items, setItems] = useState<Item[]>(SAMPLE_ITEMS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const upsert = useCallback((item: Item) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.code === item.code);
      if (i === -1) return [...prev, item];
      const next = [...prev];
      next[i] = item;
      return next;
    });
  }, []);

  const patch = useCallback((code: string, partial: Partial<Item>) => {
    setItems((prev) => prev.map((p) => (p.code === code ? { ...p, ...partial } : p)));
  }, []);

  const remove = useCallback((code: string) => {
    setItems((prev) => prev.filter((p) => p.code !== code));
  }, []);

  const reset = useCallback(() => setItems(SAMPLE_ITEMS), []);

  return { items, hydrated, upsert, patch, remove, reset, setItems };
}
