import { Subtask } from "./subtask.model";

export class Task {
    id?: string;
    status: 'todo' | 'in_progress' | 'awaiting_feedback' | 'done';
    title: string;
    description: string;
    assignedTo: string[];
    date: string;
    prio: string;
    subtasks: Subtask[] = [];
    category: string;
    color: string;


    constructor(object?: any) {
        this.id = object ? object.id : undefined;
        this.status = object ? object.status : '';
        this.title = object ? object.title : '';
        this.description = object ? object.description : '';
        this.assignedTo = object ? object.assignedTo : '';
        this.date = object ? object.date : '';
        this.prio = object ? object.prio : '';
        this.subtasks = object?.subtasks || [];
        this.category = object ? object.category : '';
        this.color = object ? object.color : '';
    }


    addSubtask(subtask: Subtask) {
        this.subtasks.push(subtask);
    }

    removeSubtask(id: string) {
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== id);
    }


    public toJSON(): any {
        const json: any = {
            status: this.status,
            title: this.title,
            description: this.description,
            assignedTo: this.assignedTo,
            date: this.date,
            prio: this.prio,
            category: this.category,
            color: this.color,
        };

        if (this.subtasks) {
            json.subtasks = this.subtasks;
        }

        return json;
    }
}