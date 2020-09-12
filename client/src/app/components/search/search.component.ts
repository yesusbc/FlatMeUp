import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication';
import  { Building } from '../../models/building';
import { AddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";
import { GLOBAL } from '../../services/global';


@Component({ 
    selector: 'search', 
    templateUrl: './search.component.html',
    providers: [PublicationService]
    }) 
export class SearchComponent implements OnInit{ 
    public title;
    public formattedaddress;
    public options;
    public status;
    public publication: Publication;
    public page;
    public total;
    public pages;
    public buildings: Building[];
    public url: string;
    @Input() commingFromHome: string;
    constructor(
        private _router: Router,
        private _publicationService: PublicationService
    ){
        this.title = "Type Address";
        this.formattedaddress ="";
        this.publication = new Publication("", "", "",{
                                                    country:"", 
                                                    state:"", 
                                                    city:"",
                                                    street:"",
                                                    buildingNumber:"",
                                                    apartment:"",
                                                    zip:""},0,"",[],"",0,0,0,0,0,0,1,0,0);
        this.options={ 
          types: [],
          fields: ['address_components', 'place_id']
        }
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('address.component loaded');
        if(this.commingFromHome){
            this.getBuildingsByPage(this.page);
        }
        
    }

    public AddressChange(address: any) { 
    //setting address from API to local variable 
        this.publication.address.buildingNumber = this.getComponentByType(address,"street_number") ? this.getComponentByType(address,"street_number").long_name : undefined;
        this.publication.address.street = this.getComponentByType(address,"route") ? this.getComponentByType(address,"route").long_name : undefined;
        this.publication.address.city = this.getComponentByType(address,"locality") ? this.getComponentByType(address,"locality").long_name : undefined;
        this.publication.address.state = this.getComponentByType(address,"administrative_area_level_1") ? this.getComponentByType(address,"administrative_area_level_1").long_name : undefined;
        this.publication.address.country = this.getComponentByType(address,"country") ? this.getComponentByType(address,"country").long_name : undefined;
        this.publication.address.zip = this.getComponentByType(address,"postal_code") ? this.getComponentByType(address,"postal_code").long_name : undefined;
    } 

    public getComponentByType(address: any, type: string): AddressComponent {
        if(!type)
            return null;

        if (!address || !address.address_components || address.address_components.length == 0)
            return null;

        type = type.toLowerCase();

        for (let comp of address.address_components) {
            if(!comp.types || comp.types.length == 0)
                continue;

            if(comp.types.findIndex(x => x.toLowerCase() == type) > -1)
                return comp;
        }

        return null;
    }

    public getBuildingsByPage(page){
        this._publicationService.getBuildingsByPage(page).subscribe(
                response => {
                    if(response.buildings){
                        this.total = response.total;
                        this.pages = response.pages;
                        this.buildings = response.buildings;

                        if (page > this.pages){
                            this._router.navigate(['/home']);
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

    public getBuildingsByAddress(page){
        this._publicationService.getBuildingsByAddress(page, this.publication).subscribe(
                response => {
                    if(response.buildings){
                        console.log(response);
                        console.log(this.buildings);
                        this.total = response.total;
                        this.pages = response.pages;
                        this.buildings = response.buildings;

                        if (page > this.pages){
                            this._router.navigate(['/home']);
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

    public explicitSearch(buildingId){
        this._router.navigate([ '/building/'+buildingId])
    }

}