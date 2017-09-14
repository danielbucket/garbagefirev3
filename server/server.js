const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

app.set('port', process.env.PORT || 3636)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/index.html'))
})




// GET ALL ITEMS
app.get('/api/v1/items', (req,res) => {
	db('items').select()
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ error }))
})

// POST TO ITEMS
app.post('/api/v1/items', (req,res) => {
	const newItem = req.body

	db('items').insert(newItem, '*')
	.then(newData => res.status(200).json({ newData }))
})

// GET ALL ITEMS WITH ASSOCIATED ITEM_STATE ID#
app.get('/api/v1/itemstate/:id', (req,res) => {
	id = req.params.id

	db('items').where('item_state_id', id).select()
	.then(data => {
		res.status(200).json({ data })
	})
})










app.listen(app.get('port'), () => {
	console.log(`app is listening on port: ${app.get('port')}` )
})
