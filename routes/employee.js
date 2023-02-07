var express = require("express");
var router = express.Router();
var pool = require("./pool");
const { v4: uuidv4 } = require("uuid");
router.post("/AddEmployee", function (req, res, next) {
 
  var employeeid = uuidv4();
  pool.query(
    "insert into employee(employeeid,firstname,lastname,designation,role,email,password,status)values(?,?,?,?,?,?,?,?)",
    [
      employeeid,
      req.body.firstname,
      req.body.lastname,
      req.body.designation,
      req.body.role,
      req.body.email,
      req.body.password,
      req.body.status,
    ],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false });
      } else {
       
        res.status(200).json({ status: true });
      }
    }
  );
});
router.get("/displayall", function (req, res) {
  pool.query(
    "select E.*,(select C.categoryname from category C where C.categoryid=E.employeeid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=E.employeeid) as subcategoryname from employee E ",
    function (error, result) {
      if (error) {
        res.status(500).json({ data: [], status: false });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});
router.post("/editemployee", function (req, res, next) {
  pool.query(
    "update employee set firstname=?,lastname=?,designation=?,role=?,email=?,status=? where employeeid=?",
    [
      req.body.firstname,
      req.body.lastname,
      req.body.designation,
      req.body.role,
      req.body.email,
      req.body.status,
      req.body.employeeid,
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
router.post("/deleteemployee", function (req, res, next) {
  pool.query(
    "delete from  employee  where employeeid=?",
    [req.body.employeeid],
    function (error, result) {
      if (error) {
        
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        res.status(200).json({ status: true, msg: "Deleted" });
      }
    }
  );
});

router.post("/displaybyemployeeid", function (req, res, next) {
  pool.query(
    "select * from employee where employeeid=?",
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

router.post("/checkLogin", function (req, res) {
  pool.query(
    "select * from employee where email=? and password=?",
    [req.body.email, req.body.password],
    function (error, result) {
      if (error) {
       
        return res
          .status(500)
          .json({ status: false, message: "Server Error!" });
      } else {
        if (result.length == 0) {
          return res
            .status(200)
            .json({ status: false, message: "Invalid Email/Password" });
        } else {
          if (result[0].status == 1) {
            return res.status(200).json({ status: true, data: result[0] });
          } else {
            return res
              .status(200)
              .json({ status: false, message: "Account got deactived" });
          }
        }
      }
    }
  );
});

router.post("/displayallleaders", function (req, res) {
  pool.query(
    "select E.*,(select concat(firstname,' ',lastname) from employee where employeeid=E.manager)as managername,(select concat(firstname,' ',lastname) from employee where employeeid=E.controller)as controllername from employee E where employeeid=?",
    [req.body.employeeid],
    function (error, result) {
      if (error) {
        
        res.status(500).json({ data: [], status: false });
      } else {
        res.status(200).json({ status: true, data: result[0] });
      }
    }
  );
});

router.post("/displayreporthours", function (req, res) {
  pool.query(
    "SELECT *,sum(T.hours) as actualhour FROM timesheet T, employee E,assignproject AP where T.employeeid=E.employeeid and T.employeeid=AP.employeeid and T.projectid=AP.projectid and T.timeid=? group by T.employeeid",
    [req.body.timeid],
    function (error, result) {
      if (error) {
        res.status(500).json({ data: [], status: false });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

module.exports = router;
