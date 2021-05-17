import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../services/local-storage.service';
import {GeneralService} from '../../services/general.service';
import {environment} from '../../../environments/environment';
import {DynamicScriptLoaderService} from '../../services/dynamic-script-loader.service';
import {NotificationService} from '../../services/notification.service';
declare var Stripe: any;

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    cities: any;
    categories: any;

    name: string;
    phone: string;
    cityId: string;
    categoryId: string;
    amount: number;
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
        this.name = '';
        this.phone = '';
        this.stripeToken = '';
        this.error = '';
        this.cityId = '';
        this.categoryId = '';
        this.amount = 25;
        this.showLoader = false;
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
                    if (this.name !== '' && this.phone !== '' && this.cityId !== '' && this.categoryId !== '' && this.amount != 0) {
                        this.stripeToken = result.token.id;
                        let body = new URLSearchParams();
                        body.set('name', this.name);
                        body.set('phone', this.phone);
                        body.set('city_id', this.cityId);
                        body.set('category_id', this.categoryId);
                        body.set('amount', this.amount.toString());
                        body.set('stripeToken', this.stripeToken);

                        this.service.savePaymentInformation(body.toString()).subscribe(data => {
                            // if(data.status==200){}
                            const response:any=data
                            if(response.status==200){
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

    resetForm(){
        this.name='';
        this.phone='';
        this.categoryId='';
        this.cityId='';
    }

}
