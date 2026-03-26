import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem<T>(key: string, data: T): void {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(
        `Ошибка при сохранении данных по ключу "${key}" в localStorage`,
        error,
      );
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const jsonData = localStorage.getItem(key);
      if (!jsonData) {
        return null;
      }
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error(
        `Ошибка при чтении данных по ключу "${key}" из localStorage`,
        error,
      );
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
