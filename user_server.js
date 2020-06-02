let express = require("express");
// let morgan = require("morgan");
// let mongoose = require("mongoose");
let bodyParser = require("body-parser");
// let uuid = require("uuid");
// let bcrypt = require("bcryptjs");

// let { NewsFeed, ClinkinsList, UserList, ActiveSessions } = require("./model");
// const { DATABASE_URL, PORT } = require("./config");

let app = express();
let jsonParser = bodyParser.json();
// mongoose.Promise = global.Promise;

app.use(express.static("public"));

// app.use(morgan("dev"));


app.get("/user-list", (req, res, next) => {
	UserList.get()
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

app.get("/user-list/:user_name", (req, res, next) => {
	UserList.get_by_id(req.params.user_name)
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

app.get("/user-list/:user_email", (req, res, next) => {
	UserList.get_by_id(req.params.user_email)
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
	UserList.post(req.body)
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



module.exports = { app };
