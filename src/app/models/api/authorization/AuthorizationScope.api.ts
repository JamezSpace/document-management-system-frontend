type AuthorizationScope =
  | {
      type: 'organization';
      id: null;
    }
  | {
      type: 'unit';
      id: string;
    }
  | {
      type: 'office';
      id: string;
    };

export type { AuthorizationScope };
