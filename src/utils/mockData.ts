export interface OperatorStats {
  id: number;
  name: string;
  leadsCount: number;
}

export interface DealerStats {
  id: number;
  name: string;
  leadsCount: number;
}

export const mockOperators: OperatorStats[] = [
  { id: 1, name: "Азиз Каримов", leadsCount: 45 },
  { id: 2, name: "Мадина Алиева", leadsCount: 38 },
  { id: 3, name: "Жамшид Тоҳиров", leadsCount: 52 },
  { id: 4, name: "Нигора Собирова", leadsCount: 29 },
  { id: 5, name: "Отабек Эргашев", leadsCount: 15 },
];

export const mockDealers: DealerStats[] = [
  { id: 101, name: "Тошкент Марказ", leadsCount: 120 },
  { id: 102, name: "Самарқанд Авто", leadsCount: 85 },
  { id: 103, name: "Фарғона Филиал", leadsCount: 64 },
  { id: 104, name: "Бухоро Диллер", leadsCount: 42 },
  { id: 105, name: "Наманган Савдо", leadsCount: 31 },
];
