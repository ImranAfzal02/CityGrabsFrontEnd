import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../services/general.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {Route, Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    keyword: string;
    amdinUrl: string;
    data: any =  [
        {
            id: 1,
            name: 'Usa'
        },
        {
            id: 2,
            name: 'England'
        }
    ];
    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private route: Router,
        private notification: NotificationService
    ) {
        this.keyword = 'name';
        this.amdinUrl = environment.adminUrl;
        this.data = [];
    }

    ngOnInit(): void {
        this.service.getCities().subscribe(data => {
            // @ts-ignore
            this.data = data.data.cities;
            this.storage.setLocalStorageItem('cities', this.data);
        }, error => {
            this.notification.showError(error, 'error');
        });
    }

    selectEvent = (item: object) => {
        this.storage.setLocalStorageItem('selectedCity', item);
        this.route.navigateByUrl('city-wall');
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

}
