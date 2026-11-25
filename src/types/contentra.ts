export type NavPage =
  | 'dashboard'
  | 'siklus'
  | 'kalender'
  | 'analytics'
  | 'library';

export type PlatformType =
  | 'Instagram'
  | 'Instagram Story'
  | 'TikTok'
  | 'X/Twitter'
  | 'Facebook';

export type ContentFormat =
  | 'Carousel'
  | 'Reels / Video Pendek'
  | 'Single Post'
  | 'Story'
  | 'Infografis'
  | 'Thread';

export type ContentStatus =
  | 'Draft'
  | 'Dalam Proses'
  | 'Terjadwal'
  | 'Terpublikasi'
  | 'Perlu Revisi';

export type MuqolipStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DecisionState = 'pending' | 'YES' | 'NO';

export type AudienceAgeGroup = '18-24' | '25-34' | '35-44' | '45+';

export interface IterationEntry {
  id: string;
  timestamp: string;
  fromStage: 5 | 6;
  decision: 'YES' | 'NO';
  targetStage?: MuqolipStage;
  notes: string;
  reviewer: string;
}

export interface MuqolipCycleData {
  currentStage: MuqolipStage;
  completedStages: MuqolipStage[];
  stage5Decision: DecisionState;
  stage5Notes: string;
  stage6ActualDate: string;
  stage6PublicNotes: string;
  stage6Decision: DecisionState;
  stage6RevisionNotes: string;
  stage7Conclusion: string;
  iterationHistory: IterationEntry[];
}

export interface ContentMetrics {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  views: number;
  audienceAgeGroup: AudienceAgeGroup;
  audienceGenderSplit: {
    female: number;
    male: number;
  };
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  communicationGoal: string;
  communicationIssue: string;
  targetAudience: string;
  desiredOutcome: string;
  keyMessage: string;
  supportingMessages: string;
  communicationStyle: string;
  platform: PlatformType;
  format: ContentFormat;
  publishDate: string; // YYYY-MM-DD
  publishTime: string; // HH:mm
  pic: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  cycle: MuqolipCycleData;
  metrics: ContentMetrics;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedContentId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export type ContentFormValues = {
  title: string;
  description: string;
  communicationGoal: string;
  targetAudience: string;
  keyMessage: string;
  platform: PlatformType;
  format: ContentFormat;
  publishDate: string;
  publishTime: string;
  pic: string;
  status: ContentStatus;
};
