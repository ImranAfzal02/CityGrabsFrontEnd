import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {CityWallComponent} from './components/city-wall/city-wall.component';
import {PaymentComponent} from './components/payment/payment.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'city-wall',
        component: CityWallComponent
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
