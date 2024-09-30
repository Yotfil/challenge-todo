import { Injectable } from '@angular/core';
import { ITask, ITaskFromService } from '../interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { ISkill } from '../interfaces/skills.interface';

interface IStates {
  tasksFromService: ITaskFromService[];
  tasksFormated: ITask[];
  tasksFiltered: ITask[];
  usersFromService: IUser[];
  usersFormated: IUser[];
  skillsFromService: ISkill[];
  skillsFormated: ISkill[];
}

@Injectable({
  providedIn: 'root',
})
export class StorageProvider {
  private states: { [K in keyof IStates]: BehaviorSubject<IStates[K]> } = {
    tasksFromService: new BehaviorSubject([] as ITaskFromService[]),
    tasksFormated: new BehaviorSubject([] as ITask[]),
    tasksFiltered: new BehaviorSubject([] as ITask[]),
    usersFromService: new BehaviorSubject([] as IUser[]),
    usersFormated: new BehaviorSubject([] as IUser[]),
    skillsFromService: new BehaviorSubject([] as ISkill[]),
    skillsFormated: new BehaviorSubject([] as ISkill[]),
  };

  constructor() {}

  setState<K extends keyof IStates>(key: K, value: IStates[K]): void {
    const state = this.states[key];
    if (state) {
      state.next(value);
    } else {
      throw new Error('Invalid state key');
    }
  }

  getState<K extends keyof IStates>(key: K): IStates[K] {
    const state = this.states[key];
    if (state) {
      return state.value;
    } else {
      throw new Error('Invalid state key');
    }
  }

  getStateObservable<K extends keyof IStates>(key: K): Observable<IStates[K]> {
    const state = this.states[key];
    if (state) {
      return state.asObservable();
    } else {
      throw new Error('Invalid state key');
    }
  }

  getManyStatesObservable<K extends keyof IStates>(
    keys: K[]
  ): Observable<IStates[K]>[] {
    return keys.map((key) => this.getStateObservable(key));
  }
}
