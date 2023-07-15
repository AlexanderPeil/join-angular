export interface ContactInterface  {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    color: string;
}


export interface TaskInterface {
    id?: string;
    status: 'todo' | 'in_progress' | 'awaiting_feedback' | 'done';
    title: string;
    description: string;
    assignedTo: string;
    date: string;
    prio: string
    subtasks: string
    category: string
    color: string;
}