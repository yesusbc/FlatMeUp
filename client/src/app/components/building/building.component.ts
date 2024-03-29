import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication';
import  { Building } from '../../models/building';
import { GLOBAL } from '../../services/global';


@Component({ 
    selector: 'building', 
    templateUrl: './building.component.html',
    providers: [PublicationService]
    }) 
export class BuildingComponent implements OnInit{ 
    public title;
    public status;
    public publications: Publication[];
    public page;
    public total;
    public pages;
    public building: Building;
    public url: string;
    public buildingId: string;
    public showImage;
    public stats;
    public globalRate;
    public hasGlobalRate;
    public globalNoise;
    public globalPriceBenefit;
    public globalLandlordSupport;
    public globalMaintenance;
    public reviewsCounter;
    public refAddress;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _publicationService: PublicationService
    ){
        this.title = "Ratings & Reviews";
        this.page = 1;
        this.building = new Building("",{
                                                    country:"", 
                                                    state:"", 
                                                    city:"",
                                                    street:"",
                                                    buildingNumber:"",
                                                    apartment:"",
                                                    zip:""},0,[],"",0);
        this.globalRate = "-";
        this.hasGlobalRate = false;
        this.globalNoise = "-";
        this.globalPriceBenefit = "-";
        this.globalLandlordSupport = "-";
        this.globalMaintenance = "-";
        this.reviewsCounter = "-";
        this.url = GLOBAL.url;
    }

    ngOnInit(){ 
        this.loadPage(); 
        this.getPublicationsByBuildingId(this.page);
    }

    loadPage(){
        this._route.params.subscribe(params => {
            this.buildingId = params['buildingId'];
            this.getBuilding(this.buildingId);
        });
    }

    getBuilding(buildingId){
        this._publicationService.getBuildingById(buildingId).subscribe(
                response => {
                    if(response.building){
                        this.building = response.building;
                        this.globalRate = response.globalRate ? response.globalRate : "--";
                        this.hasGlobalRate = response.globalRate ? true : false;
                        this.globalNoise = response.globalNoise ? response.globalNoise : "--";
                        this.globalPriceBenefit = response.globalPriceBenefit ? response.globalPriceBenefit : "--";
                        this.globalLandlordSupport = response.globalLandlordSupport ? response.globalLandlordSupport : "--";
                        this.globalMaintenance = response.globalMaintenance ? response.globalMaintenance : "--";
                        this.reviewsCounter = response.reviewsCounter ? response.reviewsCounter : "--";
                        this.refAddress = response.building.address.street + ", " + response.building.address.buildingNumber;

                    }else{
                        this.status = 'error';
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    console.log(errorMessage);
                    if(errorMessage != null){
                        this.status = 'error';
                    }
                }
            );
    }

    getPublicationsByBuildingId(page){
        this._publicationService.getPublicationsByBuildingId(this.buildingId, page).subscribe(
                response => {
                    if(response.publications){
                        this.total = response.total;
                        this.pages = response.pages;
                        this.publications = response.publications;
                        if (page > this.pages){
                            if(this.pages != 0){
                                this._router.navigate(['/home']);
                            }else{
                                // No reviews, but building
                            }
                        }
                    }else{
                        this.status = 'error';
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    console.log(errorMessage);
                    if(errorMessage != null){
                        this.status = 'error';
                    }
                }
            );
    }

    showThisImage(id){
        this.showImage = id;
    }

    hideThisImage(id){
        this.showImage = 0;
    }

    sendMessage(destUserId, refAddress){
        this._router.navigate(['profile/messages/send'], { state: { destUserId: destUserId, refAddress: refAddress } });
    }

    //function to return list of numbers from 0 to n-1 
    numSequence(n: number){
        return Array(n); 
    }

}