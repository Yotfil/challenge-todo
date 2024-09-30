import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { ITaskFromService } from '../interfaces/task.interface';
import { StorageProvider } from '../providers/storage.provider';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private http: HttpClient,
    private storageProvider: StorageProvider
  ) {}

  getTasks(): void {
    this.http
      .get<ITaskFromService[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        take(1),
        tap((tasks) => {
          this.storageProvider.setState('tasksFromService', tasks);
        })
      )
      .subscribe();
  }
}
