import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alert(message: string): void {
    this.window.alert(message);
  }

  get window() {
    return window;
  }
}
