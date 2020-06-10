let express         = require("express");
let bodyParser      = require("body-parser");
let {UserList}      = require("./user_model");
const { USER_PORT } = require("./user_config");

let app             = express();
let jsonParser      = bodyParser.json();

app.use(express.static("public"));


app.get("/user-list", (req, res, next) => {
	UserList.get_all()
		.then( users => {
			return res.status(200).json(users);
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB."
			});
		});
});


app.get("/user-list/:user_id", (req, res, next) => {
	UserList.get_by_id(req.params.user_id)
		.then( user => {
			return res.status(200).json(user);
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB."
			});
		});
});


app.post("/user-list", jsonParser, (req, res) => {
	UserList.post_new(req.body)
		.then( user => {
			return res.status(200).json(user);
		})
		.catch( err => {
			res.statusMessage = "Something went wrong with the DB."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong with the DB."
			});
		});
});


app.post("/user-login", jsonParser, (req, res) => {
	UserList.login(req.body.user_id)
		.then( user => {
			if(user){
				if(user.password == req.body.password){
					return res.status(200).json({ access: true });
				}
				else{
					return res.status(409).json({ access: false });
				}
			}
			else{
				return res.status(409).json({ access: false });
			}
		})
})


app.listen(USER_PORT)
