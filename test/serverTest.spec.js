const chai 					= require('chai');
const should 				= chai.should();
const chaiHTTP 		  = require('chai-http');
const server 			  = require('../server/server');

const environment 	= process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const db 						= require('knex')(configuration);

chai.use(chaiHTTP);

describe('client routes', () => {
	it('should be html', done => {
		chai.request(server)
		.get('/')
		.end((err, resp) => {
			resp.should.have.status(200)
			resp.should.be.html
			done()
		})
	})
})

describe('server routes', () => {
  beforeEach(done => {
    db.migrate.latest()
    .then(() => db.seed.run())
    .then(() => done())
    .catch(error => console.log(error))
  })

  afterEach(done => {
    db.migrate.rollback()
    .then(() => done())
    .then(error => console.log('Error: ',error))
  })

  it('POST api/v1/items', done => {
  	chai.request(server)
  	.post('/api/v1/items')
  	.send({
    	"name": "poney",
    	"excuse": "for the midget",
    	"item_state_id": 1
				})
  	.end((err,res) => {
  		res.should.be.a('object')
  		res.should.have.status(200)
  		res.body.newData[0].name.should.equal('poney')
  		done()
  	})
  })

  it('GET api/v1/items', done => {
  	chai.request(server)
 		.post('/api/v1/items')
  	.send({
    	"name": "poney",
    	"excuse": "for the midget",
    	"item_state_id": 1
				})
  	.end((err,res) => {
  		chai.request(server)
  		.get('/api/v1/items/')
  		.end((err,res) => {
  			res.should.have.status(200)
  			res.body.data.length.should.equal(4)
  			res.should.be.json
  			done()
  		})
  	})
  })

  it('DELETE /api/v1/items/destroy', done => {
  	chai.request(server)
  	.delete('/api/v1/items/destroy')
  	.send({id:2})
  	.end((err,res) => {
  		res.should.have.status(202)
  		res.should.be.json
  		res.body.should.be.a('object')
  		res.body.destroyed.should.equal('2 has been deleted')
  		done()
  	})

  	
  })

  	it('GET item state', done => {
  		chai.request(server)
  		.get('/api/v1/itemstate')
  		.end((err,res) => {
  			res.should.have.status(200)
  			res.should.be.json
  			res.body.conditions.length.should.equal(3)
  			res.body.conditions[0].cleanliness.should.equal('sparkling')
  			res.body.conditions[1].cleanliness.should.equal('dusty')
  			res.body.conditions[2].cleanliness.should.equal('rancid')
  			done()
  		})
  	})

  	it('GET itemstate by id 1', done => {
  		chai.request(server)
  		.get('/api/v1/itemstate/1')
  		.end((err,res) => {
  			res.should.be.json
  			res.should.have.status(200)
  			res.body.stateID[0].cleanliness.should.equal('sparkling')
  			done()
  		})
  	})

  	it('GET itemstate by id 2', done => {
  		chai.request(server)
  		.get('/api/v1/itemstate/2')
  		.end((err,res) => {
  			res.should.be.json
  			res.should.have.status(200)
  			res.body.stateID[0].cleanliness.should.equal('dusty')
  			done()
  		})
  	})

  	it('GET itemstate by id 3', done => {
  		chai.request(server)
  		.get('/api/v1/itemstate/3')
  		.end((err,res) => {
  			res.should.be.json
  			res.should.have.status(200)
  			res.body.stateID[0].cleanliness.should.equal('rancid')
  			done()
  		})
  	})

  	it('GET all items by name', done => {
  		chai.request(server)
  		.get('/api/v1/items/bling')
  		.end((err,res) => {
  			res.should.have.status(200)
  			res.should.be.json
  			res.body.data[0].name.should.equal('bling')
  			done()
  		})
  	})

  	it('PUT api/v1/items', done => {

  		chai.request(server)
  		.post('/api/v1/items')
  		.send({
    	"name": "poney",
    	"excuse": "for the midget",
    	"item_state_id": 1
				})
				.end((err,res) => {
					res.should.have.status(200)
					res.should.be.json
					res.body.newData[0].excuse.should.equal('for the midget')
					const id = res.body.newData[0].id

	  		chai.request(server)
	  		.put('/api/v1/items')
	  		.send({
							"id":`${id}`,
							"replaceWith":{
								"name": "water slide",
								"excuse": "because, just because",
								"item_state_id": 3
							}
					})
				.end((err,res) => {
					res.should.be.json
					res.should.have.status(200)
					res.body.data[0].excuse.should.equal('because, just because')
					done()
				})
				})
  	})

it('PATCH api/v1/items', done => {

  		chai.request(server)
  		.post('/api/v1/items')
  		.send({
    	"name": "chainsaw",
    	"excuse": "for cake cutting",
    	"item_state_id": 2
				})
				.end((err,res) => {
					res.should.have.status(200)
					res.should.be.json
					res.body.newData[0].name.should.equal('chainsaw')
					const id = res.body.newData[0].id

	  		chai.request(server)
	  		.patch('/api/v1/items')
	  		.send({
						"id":`${id}`,
						"updateWith":{
							"name": "blender"
						}
					})
				.end((err,res) => {
					res.should.be.json
					res.should.have.status(200)
					res.body.data[0].name.should.equal('blender')
					done()
				})
				})
  	})





})