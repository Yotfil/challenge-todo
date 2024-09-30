import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs';
import { StorageProvider } from '../providers/storage.provider';
import { ISkill } from '../interfaces/skills.interface';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor(
    private httpClient: HttpClient,
    private storageProvider: StorageProvider
  ) {}

  getSkills(): void {
    this.httpClient
      .get<ISkill[]>(
        'https://gist.githubusercontent.com/Yotfil/0955b4c0bf70c66f1e96c2514c7d3645/raw/d8d7f22c3b6aff4b7c98756cf08a52dc545b8760/habilidades.json'
      )
      .pipe(
        take(1),
        tap((skills) => {
          this.storageProvider.setState('skillsFromService', skills);
        })
      )
      .subscribe();
  }
}
