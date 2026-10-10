import raw from "./stories.json";

export type StoryType =
  | "байка"
  | "легенда"
  | "анекдот"
  | "слух"
  | "топоним"
  | "от местных";

export type Story = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  type: StoryType;
  yearStart?: number;
  yearEnd?: number;
  era: string;
  district?: string;
  placeName?: string;
  section?: string;
  lat?: number;
  lng?: number;
  /** true = координаты от реального топонима в тексте, не от рандома */
  geoBound?: boolean;
  people: string[];
  tags: string[];
  illustrationUrl: string;
  illustrationCaption: string;
  source: "книга" | "пользователь";
  status: "published" | "pending" | "rejected";
};

export const stories = raw as Story[];

export const STORY_TYPE_LABELS: Record<StoryType, string> = {
  байка: "Байки",
  легенда: "Легенды",
  анекдот: "Анекдоты",
  слух: "Слухи",
  топоним: "Топонимы",
  "от местных": "От местных",
};
