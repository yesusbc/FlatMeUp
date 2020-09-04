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
		this.publication = new Publication("","", {
													country:"", 
													state:"", 
													city:"",
											        street:"",
											        buildingNumber:0,
											        apartment:"",
											        zip:0},0,"",[],"",0,0,0,0,0,0,1,0,0);
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
						this._uploadService.makeFileRequest(this.url+'upload-image/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
								.then((result: any) => {
									this.publication.file = result.publication.image;
								});
						ReviewForm.reset();
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
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

}		

