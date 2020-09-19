import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';

@Component({
	selector: 'add',
	templateUrl: './add.component.html',
	providers: [UserService, MessageService]
})

export class AddComponent implements OnInit {
	public title: string;
	public message: Message;
	public identity;
	public token;
	public url: string;
	public status: string;
	public destUserId;
	public destUser;
	public refAddress;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _messageService: MessageService,
		private _userService: UserService
		){
		this.title = 'Send Message';
		this.identity = this._userService.getIdentity();
		this.message = new Message('','','','','',this.identity._id,'');
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;

		if(this._router.getCurrentNavigation().extras.state){
			this.destUserId = this._router.getCurrentNavigation().extras.state.destUserId;
			this.refAddress = this._router.getCurrentNavigation().extras.state.refAddress;
		}else{
			this.destUserId = this.identity._id;
			this.refAddress = "My Home";
		}
		
	}

	ngOnInit(){
		console.log('add.component loaded...');
		this.getUserPublicData(this.destUserId);
	}

	onSubmit(formAdd){
		this.message.receiver = this.destUserId;
		this.message.address = this.refAddress;
		this._messageService.addMessage(this.token, this.message).subscribe(
				response => {
					if(response.message){
						this.status = 'success';
						formAdd.reset();
					}
				},
				error => {
					this.status = 'error';
					console.log(<any>error);
				}
			);
	}

	getUserPublicData(destUserId){
        this._userService.getUserPublicData(destUserId).subscribe(
                response => {
                    if(response.user){
                        this.destUser = response.user;
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    console.log(errorMessage);
                }
		);
	}
}