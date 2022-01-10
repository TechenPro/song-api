process.env.NODE_ENV = 'test';
process.env.PORT = 3000;

// Import Mocha dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

const server = require("../src/app");

describe("Song API", () => {
    /**
     * Test searching
     */
    it("It should return nothing when no search key is provided", done => {
        chai
            .request(server)
            .get("/songs/search")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.should.be.empty;
                done();
            });
    });
    it("It should return nothing on an blank search key", done => {
        chai
            .request(server)
            .get("/songs/search?key=%20%20")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.should.be.empty;
                done();
            });
    });
    it("It should return error msg on duplicate key parameters", done => {
        chai
            .request(server)
            .get("/songs/search?key=7&key=rings")
            .end((err, res) => {
                res.should.have.status(422);
                expect(res.body.results).to.be.undefined;
                res.body.msg.should.be.a('string');
                done();
            });
    });
    it("It should have results for a search key of 0", done => {
        chai
            .request(server)
            .get("/songs/search?key=0")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.above(0);
                done();
            });
    });
    it("It should truncate results for overly broad searches", done => {
        chai
            .request(server)
            .get("/songs/search?key=a")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(500);
                res.body.msg.should.be.a("string");
                done();
            });
    });
    it("It should handle keys of special symbols", done => {
        chai
            .request(server)
            .get("/songs/search?key=%%")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(1);
                done();
            });
    });
    it("It should switch the search mode", done => {
        chai
            .request(server)
            .get("/songs/search?key=giordano&mode=artist")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(70);
                done();
            });
    });
    it("It should ignore improper search modes", done => {
        chai
            .request(server)
            .get("/songs/search?key=giordano&mode=genre")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(10);
                done();
            });
    });
    it("It should resist injected sql statements", done => {
        chai
            .request(server)
            .get("/songs/search?key=giordano;%20DROP%20TABLE%20songs;%20--")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.should.be.empty;
                done();
            });
    });

    // Popularity tests
    it("It should return 1 song with no count parameter", done => {
        chai
            .request(server)
            .get("/songs/popular")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(1);
                done();
            });
    });
    it("It should return 1 song with invalid count parameter", done => {
        chai
            .request(server)
            .get("/songs/popular?count=bob")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(1);
                done();
            });
    });
    it("It should return 1 song with multiple count parameters", done => {
        chai
            .request(server)
            .get("/songs/popular?count=4&count=7")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(1);
                done();
            });
    });
    it("It should return truncate results to 500 if higher count was requested", done => {
        chai
            .request(server)
            .get("/songs/popular?count=100000")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results.should.be.a("array");
                res.body.results.length.should.be.eql(500);
                res.body.msg.should.be.a("string");
                done();
            });
    });

    // Average duration endpoint
    it("It should return the average duration", done => {
        chai
            .request(server)
            .get("/songs/duration/avg")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.results[0].duration.should.be.a('number');
                done();
            });
    });
});
