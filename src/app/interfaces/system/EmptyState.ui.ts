enum EmptyStateType {
    FIRST_TIME = 'first time',
    NO_DATA = 'no data',
}

interface Action {
    label: string;
    route: string;
}

interface EmptyState {
    type: EmptyStateType;
    iconName: string;
    title: string;
    supportingText: string
    actions: Action[];
}

export { type EmptyState as EmptyStateInterface, EmptyStateType };

