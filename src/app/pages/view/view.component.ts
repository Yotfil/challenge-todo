import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISkill } from 'src/app/core/interfaces/skills.interface';
import { ITask } from 'src/app/core/interfaces/task.interface';
import { MapSkillsProvider } from 'src/app/core/providers/map-skills.provider';
import { MapTasksProvider } from 'src/app/core/providers/map-tasks.provider';
import { MapUsersProvider } from 'src/app/core/providers/map-users.provider';
import { StorageProvider } from 'src/app/core/providers/storage.provider';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  tasks$: Observable<ITask[]> = new Observable<ITask[]>();
  title = 'Lista de tareas';
  activeBtn = 'Todos';

  buttons = ['Todos', 'Pendientes', 'Completadas'];

  constructor(
    private storageProvider: StorageProvider,
    private mapTasksProvider: MapTasksProvider,
    private mapUsersProvider: MapUsersProvider,
    private mapSkillsProvider: MapSkillsProvider
  ) {}

  ngOnInit(): void {
    this.callServices();
  }

  callServices(): void {
    const tasksFiltered = this.storageProvider.getState('tasksFiltered');
    if (tasksFiltered.length === 0) {
      this.mapTasksProvider.getTasks();
      this.mapUsersProvider.getUsers();
      this.mapSkillsProvider.getSkills();
      this.getTasks();
    } else {
      this.getTasks();
    }
  }

  getTasks(): void {
    this.tasks$ = this.storageProvider.getStateObservable('tasksFiltered');
  }

  filter(action: string): void {
    this.activeBtn = action;
    this.mapTasksProvider.filterTasks(action);
  }

  ngOnDestroy(): void {
    // this.mapTasksProvider.finishSubsctipcion();
    // this.mapUsersProvider.finishSubsctipcion();
    // this.mapSkillsProvider.finishSubsctipcion();
  }
}
