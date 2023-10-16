export class LocalStorageMockService {

  storage: Map<string, string> = new Map();

  constructor() {
    this.storage.set('todo-list', 
    '[{"id":1,"title":"Task 1","description":"Description 1","completed":false,"createdAt":"2022-02-03T23:00:00.000Z"},{"id":4,"title":"Task 4","description":"Description 4","completed":true,"createdAt":"2022-02-06T23:00:00.000Z"},{"id":7,"title":"Task 7","description":"desc","completed":false,"createdAt":"2023-03-27T13:01:43.461Z"}]');
  }

  getItem(key: string): string | null {
    let value = this.storage.get(key);

    if (!value)
      return null;

    return value;
  }

  setItem(key: string, value: any): void {
    let json = JSON.stringify(value);
    this.storage.set(key, json);
  }
}