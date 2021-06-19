import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {

    constructor(
        private http: HttpClient
    ) { }

    getCities = () => {
        const url = environment.apiBaseUrl + '/get-cities';
        return this.http.get(url);
    }

    getCategories = () => {
        const url = environment.apiBaseUrl + '/get-categories';
        return this.http.get(url);
    }

    getCitiesAdnCategories = () => {
        const url = environment.apiBaseUrl + '/get-cities-and-categories';
        return this.http.get(url);
    }

    getCityHallData = (cityId: number) => {
        const url = environment.apiBaseUrl + '/get-city-hall-data/' + cityId;
        return this.http.get(url);
    }

    filterAddsByCategory = (cityId: number, categoryId: number) => {
        const url = environment.apiBaseUrl + '/get-filtered-city-hall-data/' + cityId + '/' + categoryId;
        return this.http.get(url);
    }

    filterAdsByShopping = (cityId: number, shopId: number) => {
        const url = environment.apiBaseUrl + '/get-city-hall-data-by-shopping/' + cityId + '/' + shopId;
        return this.http.get(url);
    }

    savePaymentInformation = (obj: any) => {
        const url = environment.apiBaseUrl + '/save-payment-information';
        return this.http.post(url, obj);
    }

    getCustomUrlData = (url: string) => {
        return this.http.get(url);
    }
}
