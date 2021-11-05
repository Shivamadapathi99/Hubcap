import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key)

    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

  setWithExpiry(key: string, value: string, ttl: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

}
