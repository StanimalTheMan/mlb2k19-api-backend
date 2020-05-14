const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe('App', function() {
  describe("Batter Data Server!", () => {
    it("gives me data for a batter e.g. Mike Trout", done => {
      chai
      .request(app)
      .get("/batting/player?firstname=Tony&lastname=Gwynn")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.length.above(0);
        done();
      });
    });  
  });
  describe("Pitcher Data Server!", () => {
    it("gives me data for a pitcher e.g. Jose Fernandez", done => {
      chai
      .request(app)
      .get("/pitching/player?firstname=Randy&lastname=Johnson")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.length.above(0);
        done();
      });
    });
  })
  /*
  describe("Get homepage", () => {
    it("gets homepage", done => {
      chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        console.log(res.text);
        expect(res.text).to.equal("it is working!");
        done();
      })
    })
  })
  */
});