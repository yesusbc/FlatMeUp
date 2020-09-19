import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'myreviews',
	templateUrl: './myreviews.component.html',
	providers: [UserService, PublicationService]
})

export class MyReviewsComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public url;
	public status;
	public publications: Publication[];
	public page;
    public total;
    public pages;
    public showImage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService
	){
		this.title = 'My Reviews';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('My Reviews component has loaded');
		this.getReviewsUser(this.page);
	}

	getReviewsUser(page){
        this._publicationService.getReviewsUser(this.token, page).subscribe(
                response => {
                    if(response.publications){
                        this.total = response.total;
                        this.pages = response.pages;
                        this.publications = response.publications;

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
    
    showThisImage(id){
        this.showImage = id;
    }

    hideThisImage(id){
        this.showImage = 0;
    }

    refresh(event = null){
        this.getReviewsUser(this.page);
    }

    deleteReview(publicationId){
        this._publicationService.deleteReviewUser(this.token, publicationId).subscribe(
            response => {
                this.refresh();    
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}