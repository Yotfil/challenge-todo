import { Injectable } from '@angular/core';
import { StorageProvider } from './storage.provider';
import { UsersService } from '../services/users.service';
import { combineLatest, map, Subscription } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { ISkill } from '../interfaces/skills.interface';

@Injectable({
  providedIn: 'root',
})
export class MapUsersProvider {
  substiprions: Subscription[] = [];
  constructor(
    private storageProvider: StorageProvider,
    private usersService: UsersService
  ) {
    this.watchUsersServiceFromStorage();
  }

  getUsers(): void {
    this.usersService.getUsers();
  }

  watchUsersServiceFromStorage(): void {
    const [usersFromService$, skillFromService$] =
      this.storageProvider.getManyStatesObservable([
        'usersFromService',
        'skillsFromService',
      ]);

    this.substiprions.push(
      combineLatest([usersFromService$, skillFromService$])
        .pipe(
          map(([usersFromService$, skillFromService$]) => {
            const usersMapped = this.mapUsers(
              usersFromService$ as IUser[],
              skillFromService$ as ISkill[]
            );
            return usersMapped;
          })
        )
        .subscribe({
          next: (users) => {
            this.storageProvider.setState('usersFormated', users);
          },
          error(err) {
            throw new Error('Hubo un problema recibiendo los usuarios', err);
          },
        })
    );
  }

  mapUsers(users: IUser[], skills: ISkill[]): IUser[] {
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      age: user.age,
      skills: this.getRandomSkills(skills),
    }));
  }

  getRandomSkills(skills: ISkill[]): ISkill[] {
    const randomSkillsCount = Math.floor(Math.random() * 3) + 1;
    const shuffledSkills = skills.sort(() => 0.5 - Math.random());
    return shuffledSkills.slice(0, randomSkillsCount);
  }

  finishSubsctipcion(): void {
    this.substiprions.forEach((subscription) => subscription.unsubscribe());
  }
}
