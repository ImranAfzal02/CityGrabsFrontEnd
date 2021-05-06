import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {CityHallComponent} from './components/city-hall/city-hall.component';
import {PaymentComponent} from './components/payment/payment.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'city-hall',
        component: CityHallComponent
    },
    {
        path: 'payment',
        component: PaymentComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
