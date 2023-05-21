var mysql = require('mysql')
var express = require('express')
var cookie = require('cookie-parser')
var db = require.main.require('./models/db_controller')

var router = express.Router()
router.get('*', function (req, res, next) {
	if (req.cookies['username'] == null) {
		res.redirect('/login')
	} else {
		next()
	}
})

router.get('/', function (req, res) {
	db.getAllemployee(function (err, result) {
		res.render('salary.ejs', { employee: result })
	})
})

router.get('/generateslip/:id', function (req, res) {
	var id = req.params.id
	db.getEmpbyId(id, function (err, result) {
		var name = result[0].name
		var id = result[0].id
		var role = result[0].role
		var email = result[0].email
		var salary = result[0].salary
		var join_date = result[0].join_date
		var contacts = result[0].contacts
		res.render('payslip.ejs', {
			name: name,
			id: id,
			email: email,
			role: role,
			salary: salary,
			join_date: join_date,
			contacts: contacts,
		})
	})
})

module.exports = router
