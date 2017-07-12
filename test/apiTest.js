const app = require('../server');
const chai = require('chai');
chai.should();
const assert = chai.assert;
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-things'));
var data = require("../vendingData");


describe("API Tests", () => {
  describe("Customer API Tests" , () => {
    describe("GET '/api/customer/items'", () => {
      it("should return an array of products", () => {
        return chai.request(app)
          .get("/api/customer/items")
          .then(res => {
            res.body.data.should.be.an('array');
            res.body.data.should.all.have.property("name");
            res.body.data.should.all.have.property("quantity");
            res.body.data.should.all.have.property("cost");
            res.body.data.should.all.have.property("id");
          })
          .catch(err=> {
            throw err;
          });
      });
    });
    describe("POST '/customer/items/:itemId/purchases'", () => {
      it("should succeed, and purchase should be present in data after execution", function(){
        let date = new Date();
        let sendObj = {
          "data":
          {
            "moneySent" : 75,
            "date" : date
          }
        };        
        return chai.request(app)
          .post("/api/customer/items/1/purchases")
          .send(sendObj)
          .then(res => {
            res.body.status.should.equal("success");
            data.purchases.find((e,i,a) => {
              return new Date(e.date).getTime() == sendObj.data.date.getTime();
            }).should.not.be.undefined;
          })
          .catch(err => {
            throw err
          });
      });
      it("should fail when accessing an invalid id" , ()=>{
                let date = new Date();
        let sendObj = {
          "data":
          {
            "moneySent" : 75,
            "date" : date
          }
        }; 
        return chai.request(app)
          .post("/api/customer/items/343242353/purchases")
          .send(sendObj)
          .then(res => {
            res.body.status.should.equal("fail");
          });
      });
    });
  });
  describe("Vendor API Tests", () => {
    describe("GET '/api/vendor/purchases'", () => {
      it("should return an array of purchase objects", () => {
        return chai.request(app)
          .get("/api/vendor/purchases")
          .then(res => {
            res.body.data.should.be.an('array');
            if (res.body.data.length > 0){
              res.body.data.should.all.have.property("date");
              res.body.data.should.all.have.property("name");
              res.body.data.should.all.have.property("moneyRecieved");
              res.body.data.should.all.have.property("changeGiven");
            }
          })
          .catch(err => {
            throw err;
          });
      });
    });
    describe("POST '/api/vendor/items'", () => {
      it("should succeed and be present in the data after execution", () => {
        return chai.request(app)
          .post("/api/vendor/items")
          .send({ "data":
                  {
                    "name": "Cherry Coke",
                    "quantity": 12,
                    "cost": 75,
                    "id": 9
                  }
                }) 
          .then( res => {
            res.body.status.should.equal("success");
            data.items.find( (e,i,a) => {
              return e.id == 9;
            }).should.not.be.undefined;
          })
          .catch(err => {
            throw err;
          });
      });
    });
    describe("PUT '/api/vendor/items/:itemId", () => {
      it ("should succeed and modified data should be present in collection", ()=> {
        return chai.request(app)
          .put("/api/vendor/items/1")
          .send({ "data":
                  {
                    "quantity":30
                  }
                })
          .then(res => {
            res.body.status.should.equal("success");
            data.items.find(e => {
              return e.id == 1;
            }).should.have.property("quantity").equal(30);
            
          })
          .catch( err => {
            throw err;
          });
      });
    });
    describe("GET 'api/vendor/money'", ()=>{
      it("should return a success status, and a number", ()=>{     
      return chai.request(app)
        .get("/api/vendor/money")
        .then(res => {
          res.body.status.should.equal("success");
          res.body.data.money.should.be.a("number");
        })
        .catch( err => {
          throw err;
        });
      });
    });
  });
});
