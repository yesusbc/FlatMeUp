import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';

@Component({
	selector: 'register',
	templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit{
	public title:string;
	public user: User;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.title = 'Register';
		this.user = new User( "",
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
			"");
	}
	ngOnInit(){
		console.log('Componente de register cargado...');
	}

	onSubmit(){
		console.log('sending form');
		console.log(this.user);
	}
}