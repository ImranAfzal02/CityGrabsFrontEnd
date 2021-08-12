import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupImageModalComponent} from '../popup-image-modal/popup-image-modal.component';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

    @Input() data: any;
    @Input() dataIndex = 0;
    @Input() loading: boolean[];

    youtubeUrl: any;
    popupImages: any;
    galleryImages: any;

    imageBaseUrl: string;

    popupImageLoading: boolean[];

    constructor(
        private sanitizer: DomSanitizer,
        private modalService: NgbModal
    ) {
        this.imageBaseUrl = environment.imageBaseUrl;
        this.youtubeUrl = '';

        this.popupImages = [];
        this.loading = [];
        this.popupImageLoading = [];
        this.galleryImages = [];

    }

    ngOnInit(): void {
    }

    setPopUpImage = (data: any) => {
        this.popupImages = data.popupImages;
        this.data = data;
        this.popupImageLoading = [];
        for (let i = 0; i < this.popupImages.length; i++) {
            this.popupImageLoading[i] = true;
        }
        const modalRef = this.modalService.open(PopupImageModalComponent);
        modalRef.componentInstance.title = '';
        modalRef.componentInstance.loading = this.popupImageLoading;
        modalRef.componentInstance.images = this.popupImages;
    }

    onLoad = (i: number, type: string) => {
        this.loading[i] = false;
    }

    setYoutubeUrl = (advertisement: any) => {
        alert(advertisement.youtube_link);
        this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(advertisement.youtube_link+'?autoplay=1&amp;modestbranding=1&amp;showinfo=0');
    }

    stopVideo = () => {
        this.youtubeUrl = '';
    }

    // @ts-ignore
    openLink = (link) => {

        if (link && link.indexOf('http') === -1) {
            link = `//${link}`;
        }

        window.open( link, '_blank');
    }

    initiateCall = (advertisement: any) => {
        // @ts-ignore
        window.location = 'tel:' + advertisement.phone;
    }

    openGalleryImages = (galleryImages: any) => {
        this.galleryImages = galleryImages;
    }

}
