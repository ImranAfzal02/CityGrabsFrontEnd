import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../services/general.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

    showLoader: boolean;
    showReloadMsg: boolean;

    cities: any;
    categories: any;

    cityId: number | null;
    cardNumber: number | null;

    businessName: string;
    email: string;

    logo: string;

    selectedItems = [];
    dropdownSettings: IDropdownSettings = {};

    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private router: Router,
        private notification: NotificationService
    ) {
        this.showLoader = false;
        this.showReloadMsg = false;

        this.cities = [];
        this.categories = [];

        this.cityId = null;
        this.cardNumber = null;

        this.businessName = '';
        this.email = '';
        this.logo = '';

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            itemsShowLimit: 5,
            allowSearchFilter: true,
            enableCheckAll: false
        };
    }

    ngOnInit(): void {
        this.service.getRequestFormInitialData().subscribe(data => {
            // @ts-ignore
            this.cities = data.data.cities;

            // @ts-ignore
            this.categories = data.data.categories;

            this.showLoader = false;
            this.showReloadMsg = false;
        }, error => {
            this.showLoader = false;
        });
    }

    reload = (e: any) => {
        e.preventDefault();
        window.location.reload();
    }

    onItemSelect = (item: any) => {
        console.log(this.selectedItems);
    }

    onSelectAll = (items: any) => {
        console.log(items);
    }

    handleFileInput = (event: any) => {
        this.logo = event.target.files.item(0);
        console.log(this.logo);
    }

    validateForm = (form: any) => {
        Object.keys(form.controls).forEach(key => {
            form.controls[key].markAsTouched();
        });
    }

    submitRequest = () => {
        this.showLoader = true;
        const formData: FormData = new FormData();
        // @ts-ignore
        formData.append('cityId', this.cityId.toString());
        // @ts-ignore
        formData.append('categories', this.selectedItems);
        // @ts-ignore
        formData.append('cardNumber', this.cardNumber);
        formData.append('businessName', this.businessName);
        formData.append('email', this.email);
        formData.append('logo', this.logo);

        this.service.submitRequestForm(formData).subscribe(data => {
            this.showLoader = false;
        }, error => {
            this.showLoader = false;
            this.notification.showError(error, 'error');
        });
    }

}
