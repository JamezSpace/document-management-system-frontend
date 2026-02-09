interface User {
  name: string;
  role: string;
  details: Record<string, string>;
  efficiencyScore: number;
  permissionLevel: number
}

export type { User };
