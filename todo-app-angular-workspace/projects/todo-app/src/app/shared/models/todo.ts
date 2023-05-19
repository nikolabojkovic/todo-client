export interface ITodo {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
}

export class Todo implements ITodo {	
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;

	constructor(id: number, title: string, description: string, completed: boolean, createdAt: Date | string) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.completed = completed;
		this.createdAt = createdAt instanceof Date ? createdAt : new Date(Date.parse(createdAt));
	}

	public static validateFields(todo: Todo) {
		return todo.id !== undefined
			&& todo.title !== undefined
			&& todo.description !== undefined
			&& todo.completed !== undefined
			&& todo.createdAt !== undefined
	}
}
