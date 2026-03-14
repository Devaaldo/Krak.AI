export interface PredictResult {
  label: string;
  confidence: number;
  gradcam: string;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  label: string;
  confidence: number;
  thumbnailBase64?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
