import { Injectable } from '@angular/core';
import { ITask, ITaskFromService } from '../interfaces/task.interface';
import { StorageProvider } from './storage.provider';
import { TasksService } from '../services/tasks.service';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class MapTasksProvider {
  tasks$: Observable<ITaskFromService[]> = new Observable<ITaskFromService[]>();
  subscriptions: Subscription[] = [];
  constructor(
    private storageProvider: StorageProvider,
    private tasksService: TasksService
  ) {
    this.watchDataFromStorage();
  }

  getTasks(): void {
    this.tasksService.getTasks();
  }

  watchDataFromStorage(): void {
    const [tasksFromService$, usersFormated$] =
      this.storageProvider.getManyStatesObservable([
        'tasksFromService',
        'usersFormated',
      ]);
    this.subscriptions.push(
      combineLatest([tasksFromService$, usersFormated$])
        .pipe(
          map(([tasksFromService$, usersFormated$]) => {
            return this.mapTasks(
              tasksFromService$ as ITaskFromService[],
              usersFormated$ as IUser[]
            );
          })
        )
        .subscribe((tasks) => {
          this.updateTasksInStorage(tasks);
        })
    );
  }

  updateTasksInStorage(tasks: ITask[]): void {
    this.storageProvider.setState('tasksFormated', tasks);
    this.storageProvider.setState('tasksFiltered', tasks);
  }

  mapTasks(tasks: ITaskFromService[], users: IUser[]): ITask[] {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      limitDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      users: this.getUsers(task.userId.toString(), users),
    }));
  }

  getUsers(id: string, users: IUser[]): IUser[] {
    return users.filter((user) => user.id === id);
  }

  filterTasks(action: string): void {
    const tasksFromStorage = this.storageProvider.getState('tasksFormated');
    const tasksFiltered = [
      ...tasksFromStorage.filter((task) => {
        switch (action) {
          case 'Pendientes':
            return !task.completed;
          case 'Completadas':
            return task.completed;
          default:
            return true;
        }
      }),
    ];
    this.storageProvider.setState('tasksFiltered', tasksFiltered);
  }

  finishSubsctipcion(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
