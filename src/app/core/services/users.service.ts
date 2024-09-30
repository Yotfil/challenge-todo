import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { StorageProvider } from '../providers/storage.provider';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private storageProvider: StorageProvider
  ) {}

  getUsers(): void {
    this.httpClient
      .get<IUser[]>(
        'https://gist.githubusercontent.com/Yotfil/b532e6fc3663b47f44e72a4d12eba093/raw/3316de07ae6b2c9a3e5eaa1c3cbc6ac391b3eee4/users.json'
      )
      .pipe(
        take(1),
        tap((users) => {
          this.storageProvider.setState('usersFromService', users);
        })
      )
      .subscribe();
  }
}
