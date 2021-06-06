import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../services/local-storage.service';
import {GeneralService} from '../../services/general.service';
import {environment} from '../../../environments/environment';
import {DynamicScriptLoaderService} from '../../services/dynamic-script-loader.service';
import {NotificationService} from '../../services/notification.service';
import {DatePickerComponent} from 'ng2-date-picker';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

declare var Stripe: any;

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    cities: any;
    categories: any;
    categoriesToShow: any;
    categoryTypes: any;

    name: string;
    phone: string;
    cityId: string;
    categoryId: string;
    categoryTypeId: string;
    amount: number;
    amountData: any;
    selectedAmountData: any;
    // @ts-ignore
    uploadDate: NgbDateStruct;
    stripeToken: string;
    error: string;
    showLoader: boolean;



    constructor(
        private service: GeneralService,
        private storage: LocalStorageService,
        private dynamicScriptLoader: DynamicScriptLoaderService,
        private notification: NotificationService
    ) {
        this.cities = [];
        this.categories = [];
        this.categoriesToShow = [];
        this.name = '';
        this.phone = '';
        this.stripeToken = '';
        this.error = '';
        this.cityId = '';
        this.categoryId = '';
        this.categoryTypeId = '';
        this.amount = 0;
        this.showLoader = false;

        this.selectedAmountData = [
            {
                value: 0,
                label: 'Select Price Package'
            }
        ];

        this.categoryTypes = [
            {
                id: 1,
                name: 'Prime Category'
            },
            {
                id: 2,
                name: 'General  Category'
            }
        ];

        this.amountData = [
            {
                value: 25,
                label: '$25 w/25 Ads Design'
            },
            {
                value: 35,
                label: '$35 w/35 Ads Design'
            },
            {
                value: 50,
                label: '$50 w/50 Ads Design'
            }
        ];

    }

    ngOnInit(): void {
        if (this.cities.length === 0 || this.categories.length === 0) {
            this.service.getCitiesAdnCategories().subscribe(data => {
                // @ts-ignore
                this.cities = data.data.cities;
                // @ts-ignore
                this.categories = data.data.categories;

                this.storage.setLocalStorageItem('cities', this.cities);
                this.storage.setLocalStorageItem('categories', this.categories);
            }, error => {
                this.notification.showError(error, 'error');
            });
        }
        this.dynamicScriptLoader.load('stripe').then(data => {
            this.stripeInit();
            // Script Loaded Successfully
        }).catch(error => console.log(error));
    }

    private stripeInit = () => {
        // Your Stripe public key

        const stripe = Stripe(environment.STRIPE_KEY);

        const style = {
            base: {
                // Add your base input styles here. For example:
                fontSize: '15px',
                lineHeight: '24px'
            }
        };
        const hidePostal = true;

        // Create `card` element that will watch for updates
        // and display error messages
        const elements = stripe.elements();
        const card = elements.create('card', { style, hidePostalCode: hidePostal });
        card.mount('#card-element');
        // @ts-ignore
        card.addEventListener('change', event => {

            if (event.error) {
                this.notification.showError(event.error.message, 'error');
                this.error = event.error.message;
            } else {
                this.error = '';
            }
        });

        // Listen for form submission, process the form with Stripe,
        // and get the
        const paymentForm = document.getElementById('payment-form');
        // @ts-ignore
        paymentForm.addEventListener('submit', event => {
            event.preventDefault();
            this.showLoader = true;

            // @ts-ignore
            stripe.createToken(card).then(result => {

                const errorElement = document.getElementById('card-errors');
                // @ts-ignore
                errorElement.textContent = '';
                if (result.error) {
                    this.showLoader = false;
                    // @ts-ignore
                    errorElement.textContent = result.error.message;
                } else {
                    console.log(this.uploadDate);
                    if (this.name !== ''
                        && this.phone !== ''
                        && this.cityId !== ''
                        && this.categoryId !== ''
                        && this.categoryTypeId !== ''
                        && this.amount !== 0
                    ) {
                        this.stripeToken = result.token.id;

                        const upDate = this.uploadDate.year + '-' + this.uploadDate.month + '-' + this.uploadDate.day;

                        let body = new URLSearchParams();
                        body.set('name', this.name);
                        body.set('phone', this.phone);
                        body.set('city_id', this.cityId);
                        body.set('category_id', this.categoryId);
                        body.set('upload_date', upDate);
                        body.set('amount', this.amount.toString());
                        body.set('stripeToken', this.stripeToken);

                        this.service.savePaymentInformation(body.toString()).subscribe(data => {
                            // if(data.status==200){}
                            const response: any = data;
                            if (response.status == 200){
                                this.notification.showSuccess(response.message, 'Success');
                                this.ngOnInit();
                                this.resetForm();
                            }else{
                                this.notification.showError(response.message, 'error');
                            }

                            this.showLoader = false;
                        }, error => {
                            this.showLoader = false;
                            this.notification.showError(error, 'error');
                        });
                    } else {
                        this.showLoader = false;
                        this.notification.showError('Please fill the form', 'error');
                    }
                }
            });
        });

    }

    resetForm = () => {
        this.name = '';
        this.phone = '';
        this.categoryId = '';
        this.cityId = '';
        this.selectedAmountData = [
            {
                value: 0,
                label: 'Select Price Package'
            }
        ];
        this.amount = 0;
    }

    filterCategories = () => {
        // tslint:disable-next-line:radix
        if (parseInt(this.categoryTypeId) === 1) {
            this.categoriesToShow = this.categories.filter((item: { isProminent: number; }) => item.isProminent == 1);
            console.log(this.categoriesToShow);
        // tslint:disable-next-line:radix
        } else if (parseInt(this.categoryTypeId) === 2) {
            this.categoriesToShow = this.categories.filter((item: { isProminent: number; }) => item.isProminent == 0);
            console.log(this.categoriesToShow);
        } else {
            this.categoriesToShow = [];
        }
        this.selectedAmountData = [
            {
                value: 0,
                label: 'Select Price Package'
            }
        ];
    }

    filterPricePackage = () => {
        // tslint:disable-next-line:radix
        const catId = parseInt(this.categoryId);
        if (catId === 7) {
            this.amount = 100;
            this.selectedAmountData = [
                {
                    value: 100,
                    label: '$100 per week / 100 Ads'
                }
            ];
        } else if (catId === 8) {
            this.amount = 25;
            this.selectedAmountData = [
                {
                    value: 25,
                    label: '$25 per month / 10 Ads'
                }
            ];
        } else if (catId === 9) {
            this.amount = 15;
            this.selectedAmountData = [
                {
                    value: 15,
                    label: '$15 per week / Ad flyer Only'
                }
            ];
        } else {
            this.amount = 25;
            this.selectedAmountData = this.amountData;
        }
    }

}
