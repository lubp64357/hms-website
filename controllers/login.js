var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var db = require.main.require('./models/db_controller')
var mysql = require('mysql')
var session = require('express-session')
var sweetalert = require('sweetalert2')
const { check, validationResult } = require('express-validator')

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'hmsystem',
})

router.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	}),
)
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post(
	'/',
	[
		check('username').notEmpty().withMessage('username required'),
		check('password').notEmpty().withMessage('password required'),
	],
	function (req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array })
		}
		var username = req.body.username
		var password = req.body.password
		// console.log(username)

		if (username && password) {
			con.query(
				'select * from users where username = ? and password = ?',
				[username, password],
				function (err, results, fields) {
					if (results.length > 0) {
						req.session.loggedin = true
						req.session.username = username
						res.cookie('username', username)
						var status = results[0].email_status
						if (status == 'not_verified') {
							res.send('please verify your email')
						} else {
							sweetalert.fire('logged in')
							res.redirects('/home')
						}
					} else {
						res.send('incorrect username or password')
					}
					res.end()
				},
			)
		} else {
			res.send('please enter your username and password')
			res.end()
		}
	},
)

module.exports = router
