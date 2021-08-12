import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-popup-image-modal',
    templateUrl: './popup-image-modal.component.html',
    styleUrls: ['./popup-image-modal.component.css']
})
export class PopupImageModalComponent implements OnInit {

    @Input() public loading: boolean[] = [];
    @Input() public images: any = [];

    imageBaseUrl: string;

    constructor(
        public activeModal: NgbActiveModal
    ) {
        this.imageBaseUrl = environment.imageBaseUrl;
    }

    ngOnInit(): void {
        console.log(this.images);
    }

    closeModal = () => {
        this.activeModal.dismiss();
    }

    initiateCall = (img: any) => {
        // @ts-ignore
        window.location = 'tel:' + img.phone;
    }

    onLoad = (i: number, type: string) => {
        this.loading[i] = false;
    }

    openLink = (link: any) => {

        if (link && link.indexOf('http') === -1) {
            link = `//${link}`;
        }

        window.open( link, '_blank');
    }

}
