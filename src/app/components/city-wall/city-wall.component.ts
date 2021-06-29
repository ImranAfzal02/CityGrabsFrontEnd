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
    nextPageUrl: string;
    selectedName: string;

    number: any;
    categories: any;
    category: any;
    advertisements: any;
    popupImages: any;
    city: any;
    prominentCategories: any;
    searchableCategories: any;
    footerLinks: any;
    shoppings: any;
    shopping: any;

    showLoader: boolean;
    showReloadMsg: boolean;
    showShopping: boolean;
    showLoadMore: boolean;

    currentPage: number;
    lastPage: number;

    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private router: Router,
        private notification: NotificationService
    ) {

        this.imageBaseUrl = environment.imageBaseUrl;

        this.keyword = 'name';
        this.popUpImage = '';
        this.searchableCategory = '';
        this.nextPageUrl = '';
        this.selectedName = '';

        this.categories = [];
        this.prominentCategories = [];
        this.searchableCategories = [];
        this.advertisements = [];
        this.popupImages = [];
        this.footerLinks = [];
        this.shoppings = [];
        this.shopping = [];

        this.city = {};
        this.category = {};

        this.showLoader = true;
        this.showReloadMsg = false;
        this.showShopping = false;
        this.showLoadMore = false;

        this.number = 200;
        this.currentPage = 0;
        this.lastPage = 0;
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
                this.setAdvertisementData(data.data);

                // @ts-ignore
                this.footerLinks = data.data.footer_links;

                // @ts-ignore
                this.selectedName = data.data.city_wall_category.name;

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
        this.advertisements = [];
        this.filterAdByCategory(cat);
    }

    filterAdByCategory = (cat: object) => {
        this.category = cat;
        this.selectedName = this.category.name;
        this.showLoader = true;
        // @ts-ignore
        this.service.filterAddsByCategory(this.city.id, this.category.id).subscribe(data => {
            this.showLoader = false;
            this.showReloadMsg = false;

            // @ts-ignore
            this.setAdvertisementData(data.data);

        }, error => {
            this.showReloadMsg = true;
            this.showLoader = false;
            this.notification.showError(error, 'error');
        });
    }

    filterAdvertisementByShopping = (shopping: object) => {
        this.showLoader = true;
        this.shopping = shopping;
        this.selectedName = this.shopping.title;
        // @ts-ignore
        this.service.filterAdsByShopping(this.city.id, shopping.id).subscribe(data => {
            this.showLoader = false;
            this.showReloadMsg = false;
            // @ts-ignore
            this.setAdvertisementData(data.data);

        }, error => {
            this.showReloadMsg = true;
            this.showLoader = false;
            this.showLoadMore = false;
            this.notification.showError(error, 'error');
        });
    }

    setAdvertisementData = (data: any) => {
        this.advertisements = data.advertisements;

        // @ts-ignore
        this.currentPage = data.currentPage;
        // @ts-ignore
        this.lastPage = data.lastPage;
        // @ts-ignore
        this.nextPageUrl = data.nextPageUrl;
        if (this.currentPage < this.lastPage) {
            this.showLoadMore = true;
        } else {
            this.showLoadMore = false;
        }
    }

    initiateCall = (advertisement: any) => {
        console.log(advertisement.phone);
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
        this.shoppings = link.shopping;
        if (this.shoppings.length > 0) {
            this.showShopping = true;
        } else {
            this.showShopping = false;
        }
    }

    hideShoppings = () => {
        this.showShopping = false;
    }

    loadMore = () => {
        // @ts-ignore
        this.showLoader = true;
        this.service.getCustomUrlData(this.nextPageUrl).subscribe(data => {
            this.showLoader = false;
            this.showReloadMsg = false;
            // @ts-ignore
            this.advertisements = this.advertisements.concat(data.data.advertisements);

            // @ts-ignore
            this.currentPage = data.data.currentPage;
            // @ts-ignore
            this.lastPage = data.data.lastPage;
            // @ts-ignore
            this.nextPageUrl = data.data.nextPageUrl;

            if (this.currentPage < this.lastPage) {
                this.showLoadMore = true;
            } else {
                this.showLoadMore = false;
            }

        }, error => {
            this.showReloadMsg = true;
            this.showLoader = false;
            this.notification.showError(error, 'error');
        });
    }

    // @ts-ignore
    openLink(link){

        if (link && link.indexOf("http") === -1) {
            link = `//${link}`;
        }

        window.open( link, '_blank');
    }
}
