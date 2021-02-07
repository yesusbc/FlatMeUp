import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})

export class LoginComponent implements OnInit{
	public title:string;
	public user:User;
	public status:string;
	public identity;
	public token;
	public birthday: Date;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Login';
		this.birthday = new Date(1900,0,0);
		this.user = new User( "","","","","","",0,0,"","","","",this.birthday);
	}
	ngOnInit(){
	}

	onSubmit(){
		// log user and get its data
		this._userService.signup(this.user).subscribe(
			response => {
				this.identity = response.user;
				if(!this.identity || !this.identity._id){
					this.status = 'error';
				}else{
					this.status = 'success';	
					// Save on storage, persisting data
					localStorage.setItem('identity', JSON.stringify(this.identity));
					// get token
					this.getToken();
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

	getToken(){
		this._userService.signup(this.user, 'true').subscribe(
			response => {
				this.token = response.token;
				if(this.token.length <= 0){
					this.status = 'error';
				}else{
					this.status = 'success';	
					// Save on storage, persisting token
					localStorage.setItem('token', this.token);
					this._router.navigate(['/']);
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