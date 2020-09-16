import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
	selector: 'main',
	templateUrl: './main.component.html'
})

export class MainComponent implements OnInit {
	public title: string;

	constructor(){
		this.title = 'Inbox';
	}

	ngOnInit(){
		console.log('main.component loaded...');
	}
}