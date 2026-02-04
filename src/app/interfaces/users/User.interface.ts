interface User {
  name: string;
  role: string;
  details: Record<string, string>;
  efficiencyScore: number;
}

export type { User };
