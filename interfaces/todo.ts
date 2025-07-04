interface Todo {
    title: string;
    description: string;
    status: 'ready' | 'in-progress' | 'completed';
}

interface TodoWithId extends Todo {
    id: number;
}