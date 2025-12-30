
export interface AccessiReport {
  narration: string;
  altText: string[];
  priorityIssue: {
    issue: string;
    wcag: string;
    fix: string;
  };
  command?: string;
}

export enum AnalysisMode {
  CAMERA = 'CAMERA',
  UPLOAD = 'UPLOAD'
}

export interface AppError {
  title: string;
  message: string;
  action: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  report: AccessiReport | null;
  error: AppError | null;
  imageData: string | null;
}
