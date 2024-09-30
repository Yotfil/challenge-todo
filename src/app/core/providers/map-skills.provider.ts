import { Injectable } from '@angular/core';
import { StorageProvider } from './storage.provider';
import { SkillsService } from '../services/skills.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapSkillsProvider {
  subscriptions: Subscription[] = [];
  constructor(
    private storageProvider: StorageProvider,
    private skillService: SkillsService
  ) {
    this.watchSkillsServiceFromStorage();
  }
  getSkills(): void {
    this.skillService.getSkills();
  }

  watchSkillsServiceFromStorage(): void {
    this.subscriptions.push(
      this.storageProvider.getStateObservable('skillsFromService').subscribe({
        next: (skills) => {
          this.storageProvider.setState('skillsFormated', skills);
        },
        error(err) {
          throw new Error('Hubo un problema recibiendo las habilidades', err);
        },
      })
    );
  }
  finishSubsctipcion(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
