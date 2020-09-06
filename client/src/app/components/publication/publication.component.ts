import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';



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
		this.publication = new Publication("","",{
													country:"", 
													state:"", 
													city:"",
											        street:"",
											        buildingNumber:"",
											        apartment:"",
											        zip:""},0,"",[],"",0,0,0,0,0,0,1,0,0);
		this.options={ 
            componentRestrictions:{ 
                types: 'address'
                // country:["MX"] 
            } 
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
						if (this.filesToUpload){
							this._uploadService.makeFileRequest(this.url+'upload-image/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
									.then((result: any) => {
										this.publication.file = result.publication.image;
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

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		console.log(this.filesToUpload);
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	public AddressChange(address: any) { 
    //setting address from API to local variable 
    this.publication.address.buildingNumber = (address.address_components[0]) ? address.address_components[0].long_name : "";
    this.publication.address.street = (address.address_components[1]) ? address.address_components[1].long_name : "";
    this.publication.address.city = (address.address_components[2]) ? address.address_components[2].long_name : "";
    this.publication.address.state = (address.address_components[3]) ? address.address_components[3].long_name : "";
    this.publication.address.country = (address.address_components[4]) ? address.address_components[4].long_name : "";
    this.publication.address.zip = (address.address_components[5]) ? address.address_components[5].long_name : "";
    
    this.addressCorrect = "success";
    if (this.publication.address.buildingNumber == "" ||
    	this.publication.address.street == "" ||
    	this.publication.address.city == "" ||
    	this.publication.address.state == "" ||
    	this.publication.address.country == "" ||
    	this.publication.address.zip == ""){
    	this.addressCorrect = "error";
    }

    this.formattedaddress = address.formatted_address;
    } 

}		

