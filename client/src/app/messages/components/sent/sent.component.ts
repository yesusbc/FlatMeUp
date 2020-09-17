import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';

@Component({
	selector: 'sent',
	templateUrl: './sent.component.html',
	providers: [UserService, MessageService]
})

export class SentComponent implements OnInit {
	public title: string;
	public messages: Message[];
	public identity;
	public token;
	public url: string;
	public status: string;
	public pages;
	public total;
	public page;
	public next_page;
	public prev_page;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _messageService: MessageService,
		private _userService: UserService
		){
		this.title = 'Sent Messages';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('sent.component loaded...');
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe( params => {
			// let user_id = params['id'];
			// this.userPageId = user_id;

			let page = params['page'];
			this.page = page;

			if(!params['page']){
				page = 1;
			}

			if (!page){
				page = 1;
			}else{
				this.next_page = page+1;
				this.prev_page = page-1;
			
				if(this.prev_page <= 0){
					this.prev_page = 1;
				}
			}
			this.getMessages(this.token, this.page);
		});
	}

	getMessages(token, page){
		this._messageService.getEmittedMessages(token, page).subscribe(
				response => {
					console.log(response);
					// console.log(response.pages);
					if(response.messages){
						this.messages = response.messages;
						this.total = response.total;
						this.pages = response.pages;

						console.log(this.messages);
					}

				},
				error => {
					console.log(<any>error);
				}
			);
	}
}