import type { Scan, ProductRecommendation, User } from "@/db/schema";

export interface ScanWithProducts extends Scan {
  products: ProductRecommendation[];
}

export interface ApiError {
  error: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Pick<User, "id" | "email" | "displayName">;
}

export interface UploadResponse {
  path: string;
  url: string;
}

export interface ScansListItem {
  id: string;
  createdAt: number;
  curlType: Scan["curlType"];
  healthScore: Scan["healthScore"];
  imagePath: string;
}
