/**
 * Сюда можно добавить свои сканы старых карт Харькова.
 * 1) Положите файл в public/maps/uploads/имя.jpg
 * 2) Допишите запись ниже с приблизительными границами (юг,запад)–(север,восток)
 *
 * Пример:
 * { url: "/maps/uploads/my-plan-1787.jpg", bounds: [[49.98, 36.20], [50.01, 36.25]], opacity: 0.85, label: "1787" }
 */
export type CustomMapOverlay = {
  url: string;
  bounds: [[number, number], [number, number]];
  opacity?: number;
  label?: string;
};

export const customMapOverlays: CustomMapOverlay[] = [
  // пусто — загрузите свои карты, я подключу
];
