var express = require("express");
var router = express.Router();
var pool = require("./pool");
const { v4: uuidv4 } = require("uuid");

router.post("/displayall", function (req, res) {
  pool.query(
    "select * from project where projectid in (SELECT projectid FROM assignproject where employeeid in (SELECT employeeid FROM employee where manager=?))",
    [req.body.manager],
    function (error, result) {
      if (error) {
      
        res.status(500).json({ data: [], status: false });
      } else {
       
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/displayprojectexpenses", function (req, res) {
  pool.query(
    "select *,T.status as tstatus from expenses T,assignproject AP,employee E,category C,subcategory S  where T.employeeid=AP.employeeid and T.employeeid=E.employeeid and C.categoryid=T.categoryid and S.subcategoryid=T.subcategoryid and AP.manager=? and T.projectid=? group by T.expensesid",
    [req.body.manager, req.body.projectid],
    function (error, result) {
      if (error) {
      
        res.status(500).json({ data: [], status: false });
      } else {
       
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});
router.post("/approvedexpenses", function (req, res) {
  pool.query(
    "update expenses set status=1 where expensesid=?",
    [req.body.expensesid],
    function (error, result) {
      if (error) {
      
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});

router.post("/nonapprovedexpenses", function (req, res) {
  pool.query(
    "update expenses set status=2 where expensesid=?",
    [req.body.expensesid],
    function (error, result) {
      if (error) {
      
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});

module.exports = router;
