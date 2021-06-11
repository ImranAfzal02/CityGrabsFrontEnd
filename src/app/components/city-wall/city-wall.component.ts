import {Component, OnInit, ViewChild} from '@angular/core';
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
    @ViewChild('auto') auto: any;
    customOptions: OwlOptions = {
        loop: true,
        margin: 10,

        dots: false,
        autoplay: true,
        autoWidth: true,

    };
    imageBaseUrl: string;
    keyword: string;
    popUpImage: string;
    searchableCategory: string;

    number: any;
    categories: any;
    advertisements: any;
    popupImages: any;
    city: any;
    category: any;
    prominentCategories: any;
    searchableCategories: any;
    footerLinks: any;
    shopping: any;

    showLoader: boolean;
    showReloadMsg: boolean;
    showShopping: boolean;

    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private router: Router,
        private notification: NotificationService
    ) {
        this.imageBaseUrl = environment.imageBaseUrl;
        this.popUpImage = '';
        this.searchableCategory = '';
        this.categories = [];
        this.prominentCategories = [];
        this.searchableCategories = [];
        this.advertisements = [];
        this.popupImages = [];
        this.footerLinks = [];
        this.shopping = [];
        this.city = {};
        this.category = {};
        this.showLoader = true;
        this.showReloadMsg = false;
        this.showShopping = false;
        this.number = 200;
        this.keyword = 'name';
    }

    ngOnInit(): void {
        this.city = this.storage.getLocalStorageItem('selectedCity');
        if (this.city) {
            // @ts-ignore
            this.service.getCityHallData(this.city.id).subscribe(data => {
                // @ts-ignore
                this.categories = data.data.categories;
                // @ts-ignore
                this.prominentCategories = data.data.prominent_categories;
                // @ts-ignore
                this.searchableCategories = data.data.searchable_categories;
                this.storage.setLocalStorageItem('categories', this.categories);
                // @ts-ignore
                this.advertisements = data.data.advertisements;
                // @ts-ignore
                this.footerLinks = data.data.footer_links;

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
    setPopUpImage = (popupImages: any) => {
        this.popupImages = popupImages;
    }

    filterAd = (cat: object) => {
        this.resetSearchable();
        this.filterAdByCategory(cat);
    }

    filterAdByCategory = (cat: object) => {
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

    filterAdvertisementByShopping = (shopping: object) => {
        this.showLoader = true;
        // @ts-ignore
        this.service.filterAdsByShopping(this.city.id, shopping.id).subscribe(data => {
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

    initiateCall = (advertisement: any) => {
        // @ts-ignore
        window.location = 'tel:' + advertisement.phone;
    }

    reload = (e: any) => {
        e.preventDefault();
        window.location.reload();
    }

    selectEvent = (item: object) => {
        this.filterAdByCategory(item);
        // do something with selected item
    }

    onChangeSearch = (val: string) => {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }


    onFocused = (e: any) => {
        e.stopPropagation();
        // do something when input is focused
    }

    resetSearchable = () => {
        this.auto.clear();
        this.auto.close();
    }

    getShopping = (e: any, link: any) => {
        e.stopPropagation();
        this.shopping = link.shopping;
        console.log(this.shopping);
        if (this.shopping.length > 0) {
            this.showShopping = true;
        } else {
            this.showShopping = false;
        }
    }
}
