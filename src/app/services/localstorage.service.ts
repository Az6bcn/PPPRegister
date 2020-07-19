import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor() { }

  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }


  get(key: string): string {
    return localStorage.getItem(key);
  }

  getToken(): string {
    return localStorage.getItem('access_token');
  }


  remove(key: string) {
    localStorage.removeItem(key);
  }

}
