/**
 * DropAgentX real backend API client.
 *
 * Talks to the deployed FastAPI backend (`marketplace-bot/web_admin.py` +
 * `app_api.py`) through the Next.js `/backend/*` rewrite. Auth follows the
 * Mini App flow: `Telegram.WebApp.initData` → `POST /api/app/auth` → Bearer
 * token kept in memory (the backend also sets an httponly cookie).
 *
 * Every request falls back gracefully: if the backend is unreachable the
 * callers keep demo data, and `getBackendOnline()` reflects the live state.
 */

import { Category, FeedResponse, Me, Product, SearchResponse } from "./types";

const BACKEND_PREFIX = "/backend";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

/** Current Bearer token (kept in memory; cookie is httponly on backend side). */
let authToken: string | null = null;

/** True once `Telegram.WebApp` is available. */
let telegramReady = false;

/** Cached `/api/app/me` result. */
let cachedMe: Me | null = null;

/** Whether the last backend probe succeeded. */
let backendOnline = false;

/** Subscribers notified whenever `backendOnline` changes. */
type Listener = (online: boolean) => void;
const listeners = new Set<Listener>();

export function onBackendStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setBackendOnline(online: boolean) {
  if (backendOnline === online) return;
  backendOnline = online;
  listeners.forEach((fn) => fn(online));
}

export function getBackendOnline(): boolean {
  return backendOnline;
}

export function getToken(): string | null {
  return authToken;
}

export function getCachedMe(): Me | null {
  return cachedMe;
}

/** Load the official Telegram Web App SDK. Resolves when it is present. */
export function ensureTelegramSdk(): Promise<typeof window.Telegram | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Telegram?.WebApp) {
    telegramReady = true;
    return Promise.resolve(window.Telegram);
  }
  return new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TELEGRAM_SCRIPT_URL}"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        telegramReady = true;
        resolve(window.Telegram ?? null);
      });
      existingScript.addEventListener("error", () => resolve(null));
      return;
    }
    const script = document.createElement("script");
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      telegramReady = true;
      resolve(window.Telegram ?? null);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

/** Current initData string, or null outside Telegram / before ready. */
export function getInitData(): string | null {
  const tg = window.Telegram?.WebApp;
  if (!tg) return null;
  try {
    tg.ready?.();
  } catch {
    /* noop */
  }
  return tg.initData || null;
}

/**
 * Authenticate with the backend using Telegram initData.
 * Returns the parsed `/api/app/me` user on success, null on failure.
 */
export async function loginWithTelegram(): Promise<Me | null> {
  if (typeof window === "undefined") return null;

  await ensureTelegramSdk();

  const initData = getInitData() || "";
  if (!initData) {
    // Outside Telegram — still probe so the LIVE badge reflects the backend.
    probeBackend();
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_PREFIX}/api/app/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
      body: JSON.stringify({ initData }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { token?: string; user?: Me };
    if (data.token) {
      authToken = data.token;
      try {
        localStorage.setItem("dgx_token", data.token);
      } catch {
        /* private mode */
      }
    }
    if (data.user) {
      cachedMe = data.user;
      setBackendOnline(true);
      return data.user;
    }
    return null;
  } catch {
    setBackendOnline(false);
    return null;
  }
}

/** Fetch current user from `/api/app/me` (auth or cookie). */
export async function fetchMe(): Promise<Me | null> {
  try {
    const data = (await apiFetch("/api/app/me")) as Me | null;
    if (data && typeof data.id === "number") {
      cachedMe = data;
      setBackendOnline(true);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/** Probe backend reachability without auth (categories is public). */
export async function probeBackend(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_PREFIX}/api/app/categories`, {
      headers: { Accept: "application/json" },
    });
    const ok = response.ok;
    setBackendOnline(ok);
    return ok;
  } catch {
    setBackendOnline(false);
    return false;
  }
}

/** Low-level authed fetch against the backend. */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  let token = authToken;
  if (!token) {
    try {
      token = localStorage.getItem("dgx_token");
    } catch {
      /* private mode */
    }
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${BACKEND_PREFIX}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    /* non-JSON body */
  }
  if (response.status === 401 && authToken) {
    authToken = null;
    try {
      localStorage.removeItem("dgx_token");
    } catch {
      /* private mode */
    }
  }
  if (!response.ok) {
    const msg =
      (payload as { detail?: string } | null)?.detail ||
      `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return payload as T;
}
/** Paged product feed. Works anonymously; authed when token/cookie present. */
export async function fetchFeed(
  mode: "foryou" | "following" = "foryou",
  cat: string = "all",
  cursor: number = 0
): Promise<FeedResponse> {
  const query = new URLSearchParams({ mode, cat, cursor: String(cursor) });
  const data = await apiFetch<FeedResponse>(`/api/app/feed?${query.toString()}`);
  setBackendOnline(true);
  return data;
}

/** Trending products for the explore/ranks view. */
export async function fetchTrending(limit = 10): Promise<FeedResponse> {
  const data = await apiFetch<FeedResponse>(`/api/app/trending?limit=${limit}`);
  setBackendOnline(true);
  return data;
}

/** Category chips with live counts. */
export async function fetchCategories(): Promise<Category[]> {
  const data = await apiFetch<{ items: Category[] }>("/api/app/categories");
  setBackendOnline(true);
  return data.items ?? [];
}

/** Search products + users. */
export async function search(q: string): Promise<SearchResponse> {
  const query = new URLSearchParams({ q });
  const data = await apiFetch<SearchResponse>(
    `/api/app/search?${query.toString()}`
  );
  setBackendOnline(true);
  return data;
}

/** Like / save / click a product. Returns true when it was toggled on. */
export async function engage(
  productId: number,
  type: "like" | "save" | "dislike" | "click"
): Promise<boolean> {
  const data = await apiFetch<{ ok: boolean; on: boolean }>("/api/app/engage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, type }),
  });
  setBackendOnline(true);
  return data.on === true;
}

const TONES = ["mint", "violet", "blue", "orange", "cyan", "pink", "gold", "green"];
const GLYPHS = ["✦", "◈", "⌘", "▶", "⚡", "✺", "₿", "▦"];

/**
 * Map a raw backend feed/search item into the shell's `Product` shape.
 * Everything is defensive — missing fields fall back to a generic display.
 */
export function toProduct(raw: Record<string, unknown>, fallbackIndex = 0): Product {
  return {
    id: Number(raw.id ?? fallbackIndex + 1),
    title: String(raw.title ?? "محصول بدون عنوان"),
    category: String(raw.category ?? "عمومی"),
    price: Number(raw.usd ?? Number(raw.price_credits ?? 0) / 1000),
    oldPrice: undefined,
    rating: Number(raw.stars ?? 0),
    sales: Number(raw.sales_count ?? 0),
    seller: String(raw.creator_name ?? "سازنده DropAgentX"),
    sellerHandle: String(raw.creator_username ? `@${raw.creator_username}` : "@creator"),
    icon: GLYPHS[fallbackIndex % GLYPHS.length],
    tone: TONES[fallbackIndex % TONES.length],
    badge: raw.is_featured ? "ویژه" : undefined,
    priceCredits: Number(raw.price_credits ?? 0),
    usd: Number(raw.usd ?? 0),
    description: typeof raw.description === "string" ? raw.description : undefined,
    photoUrl: typeof raw.photo_url === "string" ? `${BACKEND_PREFIX}${raw.photo_url}` : undefined,
    creatorId: Number(raw.creator_id ?? 0) || undefined,
    creatorUsername: typeof raw.creator_username === "string" ? raw.creator_username : undefined,
    likeCount: Number(raw.like_count ?? 0),
    commentCount: Number(raw.comment_count ?? 0),
    saveCount: Number(raw.save_count ?? 0),
    isFeatured: Boolean(raw.is_featured),
    liked: Boolean(raw.liked),
    saved: Boolean(raw.saved),
    rank: raw.rank !== undefined ? Number(raw.rank) : undefined,
  };
}

/** Map raw backend items to `Product[]`. */
export function toProducts(
  items: Array<Record<string, unknown>> | undefined
): Product[] {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => toProduct(item, index));
}