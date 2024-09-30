import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateProvider {
  constructor() {}

  getRamdomDate(): Date {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
}
