type EmptyStateKind = 'first-use' | 'no-data' | 'no-results' | 'filtered' | 'completed';
type EmptyStateActionAppearance = 'primary' | 'secondary' | 'ghost';

interface EmptyStateAction {
  id: string;
  label: string;
  route?: string | any[];
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  appearance?: EmptyStateActionAppearance;
}

interface EmptyStateConfig {
  kind: EmptyStateKind;
  iconName: string;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  compact?: boolean;
}

export type {
  EmptyStateAction,
  EmptyStateActionAppearance,
  EmptyStateConfig,
  EmptyStateKind,
};

