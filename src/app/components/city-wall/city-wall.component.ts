import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {GeneralService} from '../../services/general.service';
import {environment} from '../../../environments/environment';
import {LocalStorageService} from '../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';

@Component({
    selector: 'app-city-hall',
    templateUrl: './city-wall.component.html',
    styleUrls: ['./city-wall.component.css']
})
export class CityWallComponent implements OnInit {
    customOptions: OwlOptions = {
        loop: true,
        margin: 10,
        lazyLoad: true,
        dots: false,
        autoplay: true,
        responsive: {
            0: {
                items: 3,
            },
            767: {
                items: 6,
            },
            1200: {
                items: 9
            }
        }
    };

    imageBaseUrl: string;
    popUpImage: string;
    categories: any;
    advertisements: any;

    city: object;
    category: object;
    showLoader: boolean;
    showReloadMsg: boolean;

    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private router: Router,
        private notification: NotificationService
    ) {
        this.imageBaseUrl = environment.imageBaseUrl;
        this.popUpImage = '';
        this.categories = [];
        this.advertisements = [];
        this.city = {};
        this.category = {};
        this.showLoader = true;
        this.showReloadMsg = false;
    }

    ngOnInit(): void {
        this.city = this.storage.getLocalStorageItem('selectedCity');
        if (this.city) {
            // @ts-ignore
            this.service.getCityHallData(this.city.id).subscribe(data => {
                // @ts-ignore
                this.categories = data.data.categories;
                this.storage.setLocalStorageItem('categories', this.categories);
                // @ts-ignore
                this.advertisements = data.data.advertisements;
                this.showLoader = false;
                this.showReloadMsg = false;
            }, error => {
                this.showLoader = false;
                this.showReloadMsg = true;
            });
        } else {
            this.router.navigateByUrl('/');
        }

    }
    setPopUpImage = (url: string) => {
        this.popUpImage = url;
    }

    filterAddByCategory = (cat: object) => {
        this.category = cat;
        this.showLoader = true;
        // @ts-ignore
        this.service.filterAddsByCategory(this.city.id, this.category.id).subscribe(data => {
            this.showLoader = false;
            this.showReloadMsg = false;
            // @ts-ignore
            this.advertisements = data.data.advertisements;
        }, error => {
            this.showReloadMsg = true;
            this.showLoader = false;
            this.notification.showError(error, 'error');
        });
    }

    reload = (e: any) => {
        e.preventDefault();
        window.location.reload();
    }
}
