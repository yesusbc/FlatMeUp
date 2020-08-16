export class User{
	constructor(
		public _id:string,
		public name:string,
		public userName:string,
		public email:string,
		public password:string,
		public contributionsNumber: number,
		public gender: number,
		public occupation: string,
		public country: string,
		public state: string,
		public city: string,
		public birthday: string
	){}
}