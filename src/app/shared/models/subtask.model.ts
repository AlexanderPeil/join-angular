export class Subtask {
    id: string;
    title: string;
    completed: boolean;
  
    constructor(object?: any) {
        this.id = object ? object.id : '';
        this.title = object ? object.title : '';
        this.completed = object ? object.completed : '';
    }

    public toJSON(): any {
        const json: any = {
            id: this.id,
            title: this.title,
            completed: this.completed,
        };

        return json;
    }
  }
  