export class Tasks {
    public title: string[] = [];
    public description: string[] = [];
    public category: string[] = [];
    public assignedTo: string[] = [];
    public dueDate: string[] = [];
    public prio: string[] = [];
    public subtasks: string[] = [];

    public toJson() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            assignedTo: this.assignedTo,
            dueDate: this.dueDate,
            prio: this.prio,
            subtasks: this.subtasks
        }
    }
}