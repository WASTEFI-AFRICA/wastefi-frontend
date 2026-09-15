/**
 * WasteFi API Type Definitions
 * Shared types for API requests and responses
 */

// ============================================================================
// User & Authentication
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "collector" | "collection_point" | "admin";
  kycStatus: "pending" | "approved" | "rejected";
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  phone: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email?: string;
  role: "collector" | "collection_point";
}

// ============================================================================
// Waste Collection
// ============================================================================

export interface WasteSubmission {
  id: string;
  collectorId: string;
  collectionPointId: string;
  materialType: MaterialType;
  weight: number; // in kg
  photos: string[];
  status: "pending" | "approved" | "rejected";
  value: number; // in USD
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface CreateWasteSubmissionRequest {
  collectionPointId: string;
  materialType: MaterialType;
  weight: number;
  photos: string[]; // Base64 or URLs
}

export type MaterialType =
  | "PET_PLASTIC"
  | "HDPE_PLASTIC"
  | "MIXED_PLASTIC"
  | "CARDBOARD"
  | "PAPER"
  | "ALUMINUM"
  | "STEEL"
  | "GLASS"
  | "E_WASTE"
  | "OTHER";

// ============================================================================
// Collection Points
// ============================================================================

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  acceptedMaterials: MaterialType[];
  contactPhone: string;
  status: "active" | "inactive";
  qrCode: string;
  createdAt: string;
}

// ============================================================================
// Wallet & Transactions
// ============================================================================

export interface Wallet {
  id: string;
  userId: string;
  balance: number; // in USD
  stellarAddress?: string;
  pendingBalance: number;
  totalEarned: number;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  status: "pending" | "completed" | "failed";
  reference: string;
  description: string;
  submissionId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CashoutRequest {
  amount: number;
  method: "mobile_money" | "stellar" | "bank";
  destination: string; // Phone number, Stellar address, or bank details
}

// ============================================================================
// Analytics & Impact
// ============================================================================

export interface ImpactStats {
  userId: string;
  totalWeight: number; // kg
  totalValue: number; // USD
  co2Reduced: number; // kg
  plasticCollected: number; // kg
  treesEquivalent: number;
  collectionsCount: number;
  period: "week" | "month" | "year" | "all_time";
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
