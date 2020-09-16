import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
	selector: 'add',
	templateUrl: './add.component.html'
})

export class AddComponent implements OnInit {
	public title: string;

	constructor(){
		this.title = 'Send Message';
	}

	ngOnInit(){
		console.log('add.component loaded...');
	}
}