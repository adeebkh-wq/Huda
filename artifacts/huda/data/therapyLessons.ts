import content from './therapy-lessons.json';

export interface TherapySegment {
  heading: string;
  caption: string;
  visual: string;
}
export interface TherapyReference {
  id: string;
  organization: string;
  title: string;
  url: string;
  summary: string;
}
export interface TherapyLesson {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  benefits: string[];
  limitations: string;
  professional: string;
  referenceIds: string[];
  segments: TherapySegment[];
}

export const therapyLessons: TherapyLesson[] = content.lessons;
export const therapyReferences: TherapyReference[] = content.references;
export const therapyDurationSeconds = 48;
export { therapyMedia } from './therapyMedia';
