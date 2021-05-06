import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpInterceptorClass} from './interceptors/http-interceptor';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CityHallComponent } from './components/city-hall/city-hall.component';
import {RouterModule} from '@angular/router';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { PaymentComponent } from './components/payment/payment.component';
import {FormsModule} from '@angular/forms';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {ToastrModule} from 'ngx-toastr';

const maskConfigFunction: () => Partial<IConfig> = () => {
    return {
        validation: false,
    };
};

@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        CityHallComponent,
        HeaderComponent,
        PaymentComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AutocompleteLibModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        CarouselModule,
        FormsModule,
        NgxMaskModule.forRoot(maskConfigFunction),
        ToastrModule.forRoot({
            timeOut: 10000,
        }),
        NgxMaskModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorClass,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
