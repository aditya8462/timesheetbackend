var express = require("express");
var router = express.Router();
var pool = require("./pool");
const { v4: uuidv4 } = require("uuid");
router.post("/AddAssignproject", function (req, res, next) {

  var assignprojectid = uuidv4();
  
  pool.query(
    "insert into assignproject(assignprojectid,projectid,manager,controller,employeeid,typeid,billablehour,nonbillablehour)values(?,?,?,?,?,?,?,?)",
    [
      assignprojectid,
      req.body.projectid,
      req.body.manager,
      req.body.controller,
      req.body.employeeid,
      req.body.typeid,
      req.body.billablehour,
      req.body.nonbillablehour,
    ],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ result: false });
      } else {
        
        res.status(200).json({ result: true });
      }
    }
  );
});
router.get("/displayall", function (req, res) {
  pool.query(
    "select A.*,(select P.title from project P where P.projectid=A.projectid) as title,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=A.employeeid) as employeename,(select concat(firstname,' ',lastname) from employee where employeeid=A.manager)as managername,(select concat(firstname,' ',lastname) from employee where employeeid=A.controller)as controllername,(select TY.typename from type TY where TY.typeid=A.typeid) as typename from assignproject A ",
    function (error, result) {
      if (error) {
      
        res.status(500).json({ result: [] });
      } else {
        res.status(200).json({ result: result, data: result });
      }
    }
  );
});
router.post("/editassignproject", function (req, res, next) {

  //   changeorderid, assignprojectid, projectid, type, hour, employeeid
  var qr = "";
  if (req.body.changeorder.length) {
    qr =
      "insert into changeorder(changeorderid, assignprojectid, projectid, type, hour, employeeid) values ?;";
  }
  const changeorder = req.body.changeorder.map((item) => {
    var changeorderid = uuidv4();
    return [
      changeorderid,
      req.body.assignprojectid,
      req.body.projectid,
      item.typeid,
      item.hour,
      req.body.employeeid,
    ];
  });
  pool.query(
    "update assignproject set projectid=?,manager=?,controller=?,employeeid=?,typeid=?,billablehour=?,nonbillablehour=? where assignprojectid=?;delete from changeorder where assignprojectid=?;" +
      qr,
    [
      req.body.projectid,
      req.body.manager,
      req.body.controller,
      req.body.employeeid,
      req.body.typeid,
      req.body.billablehour,
      req.body.nonbillablehour,
      req.body.assignprojectid,
      req.body.assignprojectid,
      changeorder,
    ],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});
router.post("/deleteassignproject", function (req, res, next) {
  pool.query(
    "delete from  assignproject  where assignprojectid=?",
    [req.body.assignprojectid],
    function (error, result) {
      if (error) {
      
        res.status(500).json({ result: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ result: true, msg: "Deleted" });
      }
    }
  );
});

router.post("/displayassignprojectbyemployee", function (req, res, next) {
  pool.query(
    "select A.*,(select P.title from project P where P.projectid=A.projectid) as title from assignproject A where A.employeeid=?",
    [req.body.employeeid],
    function (error, result) {
      if (error) {
        
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ status: true, data: result[0] });
      }
    }
  );
});
router.post("/displayassignprojectbyemployeeid", function (req, res, next) {
  pool.query(
    "select * from assignproject where employeeid=?",
    [req.body.employeeid],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/displaybyassignprojectid", function (req, res, next) {
  pool.query(
    "select * from assignproject where assignprojectid=?;select * from changeorder where assignprojectid=?;",
    [req.body.assignprojectid, req.body.assignprojectid],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({
          status: true,
          data: result[0][0],
          datachangeorder: result[1],
        });
      }
    }
  );
});

module.exports = router;
