import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
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
	public url: string;
	public status: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService
	){
		this.title = 'Write a Review';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.publication = new Publication("","", {
													country:"", 
													state:"", 
													city:"",
											        street:"",
											        buildingNumber:0,
											        apartment:"",
											        zip:0},0,"","","",0,0,0,0,0,0,1,0,0);
	}

	ngOnInit(){
		console.log("write a review");
	}

	onSubmit(reviewForm){

		console.log(this.publication);
		this._publicationService.addPublication(this.token, this.publication).subscribe(
				response => {
					if (response.publication){
						// this.publication = response.publication;
						this.status = 'success';
						reviewForm.reset();
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

