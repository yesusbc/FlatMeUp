import { Component, OnInit } from '@angular/core';

@Component({ 
    selector: 'address', 
    templateUrl: './address.component.html'
    }) 
export class AddressComponent implements OnInit{ 
    public title;
    public formattedaddress;
    public options;
    public buildingNumber;
    public street;
    public city;
    public state;
    public country;
    public zip;
    constructor(){
        this.title = "Type Address";
        this.formattedaddress ="";
        this.options={ 
            componentRestrictions:{ 
                types: 'address'
                // country:["MX"] 
            } 
        }
    }

    ngOnInit(){
        console.log('address.component loaded');
    }


public AddressChange(address: any) { 
    //setting address from API to local variable 
    this.buildingNumber = address.address_components[0].long_name;
    this.street = address.address_components[1].long_name;
    this.city = address.address_components[2].long_name;
    this.state = address.address_components[3].long_name;
    this.country = address.address_components[4].long_name;
    this.zip = address.address_components[5].long_name;
    this.formattedaddress = address.formatted_address;
    } 
}