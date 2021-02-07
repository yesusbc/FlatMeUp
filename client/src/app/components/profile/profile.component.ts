import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	providers: [UserService, PublicationService]
})

export class ProfileComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public url;
	public status;
	public year;
	public month;
	public day;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService
	){
		this.title = 'Profile';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.year = "----";
		this.month = "--";
		this.day = "--";
	}

	ngOnInit(){
		this.loadPage();
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];
			this.getUser(id);
		});
	}

	getUser(id){
		this._userService.getUser(id).subscribe(
			response => {
				if(response.user){
					this.status = 'success';
					this.user = response.user;
					if(response.user.birthday){
						this.year = response.user.birthday.slice(0,4);
						this.month = response.user.birthday.slice(5,7);
						this.day = response.user.birthday.slice(8,10);
					}
				}else{
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
				this._router.navigate(['/profile', this.identity._id])
			}
		);
	}
}