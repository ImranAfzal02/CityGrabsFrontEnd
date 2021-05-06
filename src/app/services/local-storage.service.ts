import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    setLocalStorageItem = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getLocalStorageItem = (key: string) => {
        // @ts-ignore
        return JSON.parse(localStorage.getItem(key));
    }

    removeLocalStorageItem = (key: string) => {
        localStorage.removeItem(key);
    }

    clear = () => {
        localStorage.clear();
    }
}
