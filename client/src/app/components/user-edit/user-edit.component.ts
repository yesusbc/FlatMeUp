import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user-edit',
	templateUrl: './user-edit.component.html',
	providers: [UserService]
})

export class UserEditComponent implements OnInit{
	public title: string;
	public user: User;
	public identity;
	public token;
	public status: string;
	public id;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Edit profile';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		console.log(this.user);
		console.log('user-edit.component has loaded');
	}

	onSubmit(){
		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.status = 'error';
				}else{
					this.status = 'success';
					localStorage.setItem('identity', JSON.stringify(this.user));
					this.identity = this.user;
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