export interface Annotation {
  id: string;
  startIndex: number;
  endIndex: number;
  color: string;
  noteText: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  annotations: Annotation[];
}
