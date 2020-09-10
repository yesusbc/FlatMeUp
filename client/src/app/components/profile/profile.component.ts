import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	providers: [UserService]
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
		private _userService: UserService
	){
		this.title = 'Profile';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('Profile component has loaded');
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
					this.year = response.user.birthday.slice(0,4);
					this.month = response.user.birthday.slice(5,7);
					this.day = response.user.birthday.slice(8,10);
					console.log(response);
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