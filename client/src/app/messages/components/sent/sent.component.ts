import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
	selector: 'sent',
	templateUrl: './sent.component.html'
})

export class SentComponent implements OnInit {
	public title: string;

	constructor(){
		this.title = 'Sent Messages';
	}

	ngOnInit(){
		console.log('sent.component loaded...');
	}
}