import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
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
    public building: Building;
    public page;
    public total;
    public pages;
    public buildings: Building[];
    public url: string;
    @Input() commingFromHome: string;
    public next_page;
    public prev_page;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _publicationService: PublicationService
    ){
        this.title = "Type Address";
        this.formattedaddress ="";
        this.building = new Building("",{
                                                    country:"", 
                                                    state:"", 
                                                    city:"",
                                                    street:"",
                                                    buildingNumber:"",
                                                    apartment:"",
                                                    zip:""},0,[],"",0);
        this.options={ 
          types: [],
          fields: ['address_components', 'place_id']
        }
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        this.actualPage();
    }

    public AddressChange(address: any) { 
    //setting address from API to local variable 
        this.building.address.buildingNumber = this.getComponentByType(address,"street_number") ? this.getComponentByType(address,"street_number").long_name : undefined;
        this.building.address.street = this.getComponentByType(address,"route") ? this.getComponentByType(address,"route").long_name : undefined;
        this.building.address.city = this.getComponentByType(address,"locality") ? this.getComponentByType(address,"locality").long_name : undefined;
        this.building.address.state = this.getComponentByType(address,"administrative_area_level_1") ? this.getComponentByType(address,"administrative_area_level_1").long_name : undefined;
        this.building.address.country = this.getComponentByType(address,"country") ? this.getComponentByType(address,"country").long_name : undefined;
        this.building.address.zip = this.getComponentByType(address,"postal_code") ? this.getComponentByType(address,"postal_code").long_name : undefined;
    } 

    actualPage(){
        this._route.params.subscribe( params => {
            let page = params['page'];
            this.page = page;

            if(!params['page']){
                page = 1;
            }

            if (!page){
                page = 1;
            }else{
                this.next_page = parseInt(page)+1;
                this.prev_page = parseInt(page)-1;
            
                if(this.prev_page <= 0){
                    this.prev_page = 1;
                }
            }
            
            if(this.commingFromHome){
                this.getBuildingsByPage(page);
            }
            if(this.formattedaddress){
                this.getBuildingsByAddress(page);
            }
        });
    }

    getComponentByType(address: any, type: string): AddressComponent {
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

    getBuildingsByPage(page){
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

    getBuildingsByAddress(page){
        this.page = page;
        this._publicationService.getBuildingsByAddress(page, this.building).subscribe(
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

    explicitSearch(buildingId){
        this._router.navigate([ '/building/'+buildingId])
    }

    changePage(page, buildings){
        this._router.navigate(['search'], { state: { page: page, buildings: buildings } });
    }

    //function to return list of numbers from 0 to n-1 
    numSequence(n: number){
        n = Math.round(n);
        if(n > 5)
        {
           n = 5;
        }
        if(n < 0)
        {
           n = 0;
        }
        return Array(n); 
    }

}
