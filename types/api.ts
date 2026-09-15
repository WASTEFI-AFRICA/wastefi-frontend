/**
 * API Types
 * Type definitions for API requests and responses
 */

export type UserRole = "collector" | "collection_point" | "admin";

export type MaterialType =
  | "plastic"
  | "paper"
  | "metal"
  | "glass"
  | "e-waste"
  | "textiles"
  | "organic"
  | "cardboard"
  | "batteries"
  | "mixed";

export type TransactionType =
  | "collection"
  | "cashout"
  | "bonus"
  | "penalty"
  | "refund";

export type CollectionStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "paid";

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  createdAt: string;
  lastActive?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface WalletBalance {
  usd: number;
  xlm: number;
  lastUpdated: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: "usd" | "xlm";
  stellarAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: "usd" | "xlm";
  status: "pending" | "completed" | "failed";
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  acceptedMaterials: MaterialType[];
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  rating?: number;
  totalCollections?: number;
  verified: boolean;
  createdAt: string;
}

export interface WasteSubmission {
  id: string;
  collectorId: string;
  collectionPointId: string;
  materialType: MaterialType;
  weight: number;
  photos: string[];
  status: CollectionStatus;
  location?: {
    lat: number;
    lng: number;
  };
  estimatedValue?: number;
  actualValue?: number;
  verifiedAt?: string;
  createdAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Request types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  password: string;
  termsAccepted: boolean;
}

export interface VerifyPhoneRequest {
  phone: string;
  code: string;
}

export interface SubmitWasteRequest {
  collectionPointId: string;
  materialType: MaterialType;
  weight: number;
  photos: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface CashoutRequest {
  amount: number;
  currency: "usd" | "xlm";
  method: "mobile_money" | "stellar" | "bank_transfer";
  destination: string;
}
