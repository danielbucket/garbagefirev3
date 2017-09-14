const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../server/server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHTTP)

describe('it', () => {
	it('it', done => {
		chai.request(server)

		.get('/')
  .end((err, response) => {
   response.should.have.status(200)
   response.should.be.html
   done()
  })
	})
})