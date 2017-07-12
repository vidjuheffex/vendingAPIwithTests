const express= require('express');
const apiRouter = express.Router();
var data = require("../vendingData.js");

apiRouter.get("/customer/items", (req, res) => {
  let responseObj = {
    "status": "success",
    "data": data.items
  };
  return res.json(responseObj);  
});

apiRouter.post("/customer/items/:itemId/purchases", (req,res) => {
  let status ="";
  let resData;
  let item = data.items.find(e => e.id == req.params.itemId);
  if(item){
    if (req.body.data.moneySent >= item.cost){
      status = "success";
      let change = req.body.data.moneySent - item.cost;
      data.total += req.body.data.moneySent;
      data.total -= change;
      data.purchases.push({
        "name" : item.name,
        "moneyRecieved" : req.body.data.moneySent,
        "changeGiven" : change,
        "date" : req.body.data.date
      });
      resData = {
        "change" : change
      };
    }
    else {
      status = "fail";
      resData = "not enough money";
    }
  }
  else {
    status = "fail";
    resData = "item not found";
  }
  return res.json({
    "status" : status,
    "data": resData
  });
});

apiRouter.get("/vendor/purchases", (req, res) => {
  let responseObj = {
    "status":"success",
    "data": data.purchases 
  };
  return res.json(responseObj);
});

apiRouter.post("/vendor/items", (req, res) => {
  data.items.push(req.body.data);
  let responseObj = {
    "status": "success",
    "data": req.body.data
  };
  return res.json(responseObj);
});

apiRouter.put("/vendor/items/:itemId", (req,res) => {
  let item = data.items.find(e => {
    return e.id == req.params.itemId;
  });
  if(item){
     for (let x in req.body.data){
       item[x] = req.body.data[x]; 
     }
  }
 
  return res.json({
    "status":"success"
  });
});

apiRouter.get("/vendor/money", (req,res) => {
  return res.json({
    "status" : "success",
    "data" : {
      "money" : data.total
    }
  });
});

module.exports = apiRouter;


