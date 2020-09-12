import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { AddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";


@Component({
	selector: 'publication',
	templateUrl: './publication.component.html',
	providers: [UserService, UploadService, PublicationService]
})

export class PublicationComponent implements OnInit{
	public identity;
	public token;
	public title: string;
	public publication: Publication;
	public user: User;
	public url: string;
	public status: string;
    public formattedaddress;
    public options;
    public addressCorrect;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _uploadService: UploadService,
		private _publicationService: PublicationService
	){
		this.title = 'Write a Review';
		this.user = this._userService.getIdentity();
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.publication = new Publication("","", "",{
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
	}

	ngOnInit(){
		console.log("write a review");
	}

	onSubmit(ReviewForm){

		console.log(this.publication);
		this._publicationService.addPublication(this.token, this.publication).subscribe(
				response => {
					if (response.publication){
						// this.publication = response.publication;
						this.status = 'success';
						if (this.filesToUploadPub){
							this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUploadPub, this.token, 'image')
									.then((result: any) => {
										this.publication.file = result.publication.image;
									});
						}
						if (this.filesToUploadBuilding){
							this._uploadService.makeFileRequest(this.url+'upload-image-building/'+response.publication.buildingId, [], this.filesToUploadBuilding, this.token, 'image')
									.then((result: any) => {
									});
						}
						ReviewForm.reset();
						this.formattedaddress = "";
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

	public filesToUploadPub: Array<File>;
	public filesToUploadBuilding: Array<File>;
	fileChangeEvent(fileInput: any, reason){
		console.log(reason);
		if(reason=='pub'){
			console.log(this.filesToUploadPub);
			this.filesToUploadPub = <Array<File>>fileInput.target.files;
		}
		if(reason=='building'){
			console.log(this.filesToUploadBuilding);
			this.filesToUploadBuilding = <Array<File>>fileInput.target.files;
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
        
        this.addressCorrect = "success";
    	if (this.publication.address.buildingNumber == undefined ||
    		this.publication.address.street == undefined ){
    		this.addressCorrect = "error";
    	} 

    	this.formattedaddress = address.formatted_address;
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

}		

