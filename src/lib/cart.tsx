import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { checkoutCompleted } from "@/lib/checkout.functions";

export interface BagItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface BagContextValue {
  items: BagItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (item: BagItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);
const STORAGE_KEY = "theritualera.bag.v1";
/* Shopify cart id of the last checkout we sent the shopper to. */
const PENDING_CHECKOUT_KEY = "theritualera.checkout.v1";

export function rememberCheckout(cartId: string) {
  try {
    localStorage.setItem(PENDING_CHECKOUT_KEY, cartId);
  } catch {
    /* storage blocked: the bag just won't auto-empty after the order */
  }
}

function readStored(): BagItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BagItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  /* Back from a completed Shopify checkout: empty the bag so it doesn't offer the same pieces again. */
  useEffect(() => {
    let cartId: string | null = null;
    try {
      cartId = localStorage.getItem(PENDING_CHECKOUT_KEY);
    } catch {
      return;
    }
    if (!cartId) return;
    checkoutCompleted({ data: { cartId } })
      .then((done) => {
        if (!done) return;
        setItems([]);
        localStorage.removeItem(PENDING_CHECKOUT_KEY);
      })
      .catch(() => {
        /* try again on the next visit */
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: BagItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId && i.size === item.size);
      if (idx >= 0) {
        const current = prev[idx];
        if (!current) return [...prev, { ...item, quantity: Math.min(item.quantity, 10) }];
        const next = [...prev];
        next[idx] = { ...current, quantity: Math.min(current.quantity + item.quantity, 10) };
        return next;
      }
      return [...prev, { ...item, quantity: Math.min(item.quantity, 10) }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.size === size))
        : prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity: Math.min(quantity, 10) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openBag = useCallback(() => setOpen(true), []);
  const closeBag = useCallback(() => setOpen(false), []);

  const value = useMemo<BagContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { items, count, subtotal, isOpen, openBag, closeBag, addItem, removeItem, updateQuantity, clear };
  }, [items, isOpen, openBag, closeBag, addItem, removeItem, updateQuantity, clear]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
