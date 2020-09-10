import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{
	public title:string;

	constructor(
		private _router: Router,
	){
		this.title = 'Welcome to FlatMeUp';
	}

	ngOnInit(){
		console.log('home.component loaded');
	}


}