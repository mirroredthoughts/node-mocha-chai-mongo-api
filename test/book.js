// For testing env is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../controllers/models/book');

//Adding devDependencies

let chai =require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;


chai.use(chaiHttp);

describe('Books',()=> {
  beforeEach((done)=> {
    //befor each test empty db
    Book.remove({},(err)=> {
      done();
    });
  });

  /*
  * Test /GET
  */

  describe('/GET book', () => {
    it('should GET all books',(done) =>{
      chai.request(server).get('/book').end((err,res)=>{
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });
});

describe('/POST book',()=> {
  it('should not save book with out page field',(done) =>{
    let book ={
      title: "The Lord of the rings",
      year:1954,
      author:"J.R.R Tolkien"
    }

    chai.request(server).post('/book').send(book).end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.property('pages');
      res.body.errors.pages.should.have.property('kind').eql('required');
      done();
    });
  });

  it('should POST a book',(done)=> {
    let book = {
      title: "The Lord of the rings",
      year: 1954,
      author:"J.R.R Tolkien",
      pages: 1170
    }
    chai.request(server).post('/book').send(book).end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Book successfully added!');
      res.body.book.should.have.property('title');
      res.body.book.should.have.property('author');
      res.body.book.should.have.property('pages');
      res.body.book.should.have.property('year');
      done();
    });
  });
});

describe('/GET/:id book',()=> {
  it('should GET a book for given id',(done)=> {
    let book = new Book({
      title:"Animal Farm",
      author:"George Orwell",
      year: 1945,
      pages:80
    });
    book.save((err,book)=>{
      chai.request(server).get('/book/'+book.id).send(book).end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('author');
        res.body.should.have.property('year');
        res.body.should.have.property('pages');
        res.body.should.have.property('_id').eql(book.id);
        done();
      });
    });
  });
});


describe('/PUT/:id book',()=>{
  it('should UPDATE a book given the id',(done)=>{
    let book= new Book({
      title:"The chronicles of Narnia",
      author:"Lewis",
      year:1948,
      pages:778
    });
    book.save((err,book)=>{
      chai.request(server)
      .put('/book/'+book.id).send({author:"C.S. Lewis"})
      .end((err,res)=>{
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Book updated!');
        res.body.book.should.have.property('author').eql('C.S. Lewis');
        done();
      });
    });
  });
});


describe('/DELETE/:id book',()=>{
  it('should DELETE a book given the id',(done)=> {
    let book = new Book({
      title:"The chronicles of Narnia",
      author:"Lewis",
      year:1948,
      pages:778
    });
    book.save((err,book)=>{
      chai.request(server).delete('/book/'+book.id).end((err,res)=>{
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Book successfully deleted!');
        res.body.result.should.have.property('ok').eql(1);
        res.body.result.should.have.property('n').eql(1);
        done();
      });
    });
  });
});
