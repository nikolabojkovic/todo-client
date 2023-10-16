export class LocalStorageProvider {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any): void {
    let json = JSON.stringify(value);
    localStorage.setItem(key, json);
  }
}