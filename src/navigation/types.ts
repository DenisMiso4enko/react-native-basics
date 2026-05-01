/** Стек первого таба: старт → «Основы». */
export type RootStackParamList = {
  Home: undefined;
  Basics: undefined;
};

/** Стек таба «Ещё»: корень → второй экран (тот же паттерн, что у «Обзора»). */
export type ExtrasStackParamList = {
  ExtrasHome: undefined;
  ExtrasPractice: undefined;
};

/** Нижний таб-бар — отдельные «ветки» навигации. */
export type MainTabParamList = {
  Overview: undefined;
  Extras: undefined;
};
