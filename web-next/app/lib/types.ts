export type NavKey =
  | "home"
  | "explore"
  | "shop"
  | "create"
  | "activity"
  | "profile"
  | "messages"
  | "wallet"
  | "orders"
  | "saved"
  | "collections"
  | "analytics"
  | "settings"
  | "admin"
  | "features";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  sales: number;
  seller: string;
  sellerHandle: string;
  icon: string;
  tone: string;
  badge?: string;
  /** Real backend fields (from `/api/app/*`) */
  priceCredits?: number;
  usd?: number;
  description?: string;
  photoUrl?: string;
  creatorId?: number;
  creatorUsername?: string;
  likeCount?: number;
  commentCount?: number;
  saveCount?: number;
  isFeatured?: boolean;
  liked?: boolean;
  saved?: boolean;
  rank?: number;
};

/** Shape returned by the real backend for a Mini App user (`/api/app/me`). */
export type Me = {
  id: number;
  name: string;
  username: string;
  credits: number;
  role: string;
};

/** Category chip from `/api/app/categories`. */
export type Category = {
  key: string;
  fa: string;
  icon: string;
  count: number;
};

/** Paged feed response from `/api/app/feed` and `/api/app/trending`. */
export type FeedResponse = {
  items: Array<Record<string, unknown>>;
  next?: number | null;
};

/** Search response from `/api/app/search`. */
export type SearchResponse = {
  products: Array<Record<string, unknown>>;
  users: Array<Record<string, unknown>>;
};

export type Post = {
  id: number;
  author: string;
  handle: string;
  initials: string;
  tone: string;
  time: string;
  text: string;
  tags: string[];
  likes: number;
  comments: number;
  reposts: number;
  productId?: number;
  liked?: boolean;
  saved?: boolean;
};

export type Notification = {
  id: number;
  type: "like" | "sale" | "follow" | "comment" | "system";
  title: string;
  text: string;
  time: string;
  unread: boolean;
  icon: string;
};
