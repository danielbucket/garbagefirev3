const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

const getItemState = require('./serverMiddleware').getItemState
const checkItemState = require('./serverMiddleware').checkItemState

app.set('port', process.env.PORT || 3636)

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('process.env.PORT: ', process.env.PORT)


app.use(express.static(__dirname + '/../public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

app.get('/', (req,res) => {
	res.sendFile(path.join(__dirname + '/../public/index.html'))
})

// DELETE ITEM FROM DB
app.delete('/api/v1/items/destroy', (req,res) => {
	const id = req.body.newId;

	db('items').where('id', id)
	.del()
	.then(() => res.status(202).json({
		destroyed:`${id} has been deleted`, id:id 
	}))
})

// GET ITEMS_STATE
app.get('/api/v1/itemstate', (req,res) => {
	db('items_state').select()
	.then(conditions => res.status(200).json({ conditions }))
	.catch(error => res.status(500).json({ error }))
})

// GET ITEMSTATE BY ID
app.get('/api/v1/itemstate/:id', (req,res) => {
	const id = req.params.id;

	db('items_state').where('id', id)
	.select('cleanliness')
	.then(stateID => {
		res.status(200).json({ stateID })
	})
})

app.get('/api/v1/cleanliness/:cleanliness', (req,res) => {
	const cleanliness = req.params.cleanliness;

	db('items_state').where('cleanliness', cleanliness)
	.select('id')
	.then(id => res.status(200).json({ id }))
	.catch(error => res.status(500).json({ error }))
})


//	GET ITEMS BY NAME
app.get('/api/v1/items/:name', (req,res) => {
	const name = req.params.name

	db('items').where('name', name)
	.select()
	.then(data => res.status(200).json({ data }))
	.catch(error => res.status(500).json({ data }))
})

//------> API/V1/ITEMS <------//
app.route('/api/v1/items')
	.patch((req,res) => {
			const id = req.body.id;
			const toUpdate = Object.keys(req.body.updateWith)[0];
			const updateWith = req.body.updateWith;

			db('items').where('id', id)
			.update(updateWith)
			.then(() => {
				db('items').select('*')
				.then(data => res.status(200).json({ data }))
			})
	.catch(error => res.status(500).json({ error }))
	})
	.put((req,res) => {
		const id = req.body.id;
		const newPut = req.body.replaceWith

		db('items').where('id', id)
		.update(newPut, '*')
		.then(() => {
			db('items').select('*')
			.then(data => res.status(200).json({ data }))
				.catch(error => res.status(500).json({ error }))
		})
		.catch(error => res.status(500).json({ error }))
	})
	.post(getItemState, (req,res) => {
		db('items').insert(req.body)
		.then(newData => {
			db('items').select('*')
			.then(data => res.status(200).json({ data }))
			.catch(error => res.status(500).json({ error }))
		})
		.catch(error => res.status(500).json({ error }))
	})
	.get((req,res) => {
		db('items')
		.select('*')
		.then(data => res.status(200).json({ data }))
		.catch(error => res.status(500).json({ error }))
	})

app.listen(app.get('port'), () => {
	console.log(`app is listening on port: ${app.get('port')}` )
})

module.exports = app
