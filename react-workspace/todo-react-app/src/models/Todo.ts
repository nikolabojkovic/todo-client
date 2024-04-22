export interface ITodo {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	sortId: number;
}

export class Todo implements ITodo {	
	id: number;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	sortId: number;

	constructor(id: number, title: string, description: string, completed: boolean, createdAt: Date | string, sortId: number) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.completed = completed;
		this.createdAt = createdAt instanceof Date ? createdAt : new Date(Date.parse(createdAt));
		this.sortId = sortId;
	}

	public static validateFields(todo: Todo) {
		return todo.id !== undefined
			&& todo.title !== undefined
			&& todo.description !== undefined
			&& todo.completed !== undefined
			&& todo.createdAt !== undefined
			&& todo.sortId !== undefined;
	}
}


