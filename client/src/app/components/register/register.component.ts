import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	providers: [UserService]
})

export class RegisterComponent implements OnInit{
	public title:string;
	public user: User;
	public status: string;
	public birthday: Date;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Register';
		this.birthday = new Date(1900,0,0);
		this.user = new User( "",
			"",
			"",
			"",
			"",
			"",
			0,
			0,
			"",
			"",
			"",
			"",
			this.birthday);
	}
	ngOnInit(){
		console.log('Componente de register cargado...');
	}

	onSubmit(registerForm){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.user && response.user._id){
					this.status = 'success';
					registerForm.reset();
				}else{
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
			}
		);

	}
}