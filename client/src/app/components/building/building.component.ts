import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
// import { Publication } from '../../models/publication';
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
    // public publication: Publication;
    // public page;
    // public total;
    // public pages;
    public building: Building;
    public url: string;
    public buildingId: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _publicationService: PublicationService
    ){
        this.title = "Building";
        // this.buildingId = "5f55b72304fe8f1658fb6426";
        this.building = new Building("",{
                                                    country:"", 
                                                    state:"", 
                                                    city:"",
                                                    street:"",
                                                    buildingNumber:"",
                                                    apartment:"",
                                                    zip:""},0,[],"",0,0,0,0,0,0);
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('building.component loaded');    
        this.loadPage(); 
    }

    loadPage(){
        this._route.params.subscribe(params => {
            this.buildingId = params['buildingId'];
            this.getBuilding(this.buildingId);
        });
    }

    public getBuilding(buildingId){
        this._publicationService.getBuildingById(buildingId).subscribe(
                response => {
                    if(response.building){
                        console.log("success");
                        console.log(response);
                        this.building = response.building;

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



}