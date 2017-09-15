const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

app.set('port', process.env.PORT || 3636)

app.use(express.static(__dirname + '/../public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/index.html'))
})




// DELETE ITEM FROM DB
app.delete('/api/v1/items/destroy', (req, res) => {
	const id = req.body.id;
	db('items').where('id', id).del()
	.then(() => res.status(202).json({ destroyed:`${id} has been deleted`}))
})

// GET ITEMS_STATE
app.get('/api/v1/itemstate', (req,res) => {
	db('items_state').select()
	.then(conditions => res.status(200).json({ conditions }))
	.catch(error => res.status(500).json({ error }))
})

// GET ITEMSTATE BY ID
app.get('/api/v1/itemsstate/:id', (req,res) => {
	const id = req.params.id;

	db('items_state').where('id', id).select('cleanliness')
	.then(stateID => {
		res.status(200).json({ stateID })
	})
})


// GET ALL ITEMS
app.get('/api/v1/items', (req,res) => {

	db('items').select('*')
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ error }))
})

// POST TO ITEMS
app.post('/api/v1/items', (req,res) => {
	const newItem = req.body

	db('items').insert(newItem, '*')
	.then(newData => res.status(200).json({ newData }))
	.catch(error => res.status(500).json({ data }))
})

// GET ALL ITEMS WITH ASSOCIATED ITEM_STATE ID#
app.get('/api/v1/itemstate/:id', (req,res) => {
	id = req.params.id

	db('items_state').where('id', id).select()
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ error }))
})

//	GET ITEMS BY NAME
app.get('/api/v1/items/:name', (req,res) => {
	const name = req.params.name

	db('items').where('name', name).select()
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ data }))
})

// PUT ITEM
app.put('/api/v1/items', (req,res) => {
	const id = req.body.id;
	const newPut = req.body.replaceWith

	db('items').where('id', id)
	.update(newPut, '*')
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ error }))
})


// PATCH ITEM
app.patch('/api/v1/items', (req,res) => {
	const id = req.body.id;
	const toUpdate = Object.keys(req.body.updateWith)[0]
	const updateWith = req.body.updateWith;

	db('items').where('id', id).select(toUpdate)
	.update(updateWith, '*')
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ error }))
})


app.listen(app.get('port'), () => {
	console.log(`app is listening on port: ${app.get('port')}` )
})

module.exports = app
