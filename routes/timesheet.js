var express = require("express");
var router = express.Router();
var pool = require("./pool");
const { v4: uuidv4 } = require("uuid");
router.post("/AddTimesheet", function (req, res, next) {
 
  var timesheetid = uuidv4();
  pool.query(
    "select sum(CASE WHEN ? = 1 THEN billablehour ELSE nonbillablehour END) as hours,(select C.hour from changeorder C where C.assignprojectid=assignprojectid and typeid=?) as extrahours from assignproject where projectid=? and employeeid=? and typeid=?;select sum(hours) as filledhours from timesheet where projectid=? and employeeid=? and typeid=? and timeid=?;",
    [
      req.body.timeid,
      req.body.typeid,
      req.body.projectid,
      req.body.employeeid,
      req.body.typeid,
      req.body.projectid,
      req.body.employeeid,
      req.body.typeid,
      req.body.timeid,
    ],
    (err, data) => {
      if (err) {
      } else {
        const actualData =
          parseFloat(data[0][0].hours ? data[0][0].hours : 0) +
          parseFloat(data[0][0].extrahours ? data[0][0].extrahours : 0);
        const filledhours = data[1][0].filledhours ? data[1][0].filledhours : 0;
        const remainingHours = actualData - filledhours;
       
        if (req.body.hours > remainingHours) {
          res.status(500).json({
            status: false,
            message:
              "Limit exceed please hours under or equal to " + remainingHours,
          });
        } else {
          pool.query(
            "insert into timesheet(timesheetid,employeeid,projectid,date,description,hours,typeid,timeid,status)values(?,?,?,?,?,?,?,?,?)",
            [
              timesheetid,
              req.body.employeeid,
              req.body.projectid,
              req.body.date,
              req.body.description,
              req.body.hours,
              req.body.typeid,
              req.body.timeid,
              0,
            ],
            function (error, result) {
              if (error) {
               
                res.status(500).json({ status: false });
              } else {
                
                res.status(200).json({ status: true });
              }
            }
          );
        }
      }
    }
  );
});
router.get("/displayall", function (req, res) {
  pool.query(
    "select T.*,(select P.title from project P where P.projectid=T.projectid) as title,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=T.employeeid) as employeename,(select TY.typename from type TY where TY.typeid=T.typeid) as typename from timesheet T ",
    function (error, result) {
      if (error) {
        res.status(500).json({ data: [], status: false });
      } else {
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});
router.post("/edittimesheet", function (req, res, next) {
  pool.query(
    "update timesheet set employeeid=?,projectid=?,date=?,description=?,hours=?,typeid=?,timeid=? where timesheetid=?",
    [
      req.body.employeeid,
      req.body.projectid,
      req.body.date,
      req.body.description,
      req.body.hours,
      req.body.typeid,
      req.body.timeid,
      req.body.timesheetid,
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
router.post("/deletetimesheet", function (req, res, next) {
  pool.query(
    "delete from  timesheet  where timesheetid=?",
    [req.body.timesheetid],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        res.status(200).json({ status: true, msg: "Deleted" });
      }
    }
  );
});

router.post("/displaybytimesheetid", function (req, res, next) {
  pool.query(
    "select * from timesheet where timesheetid=?",
    [req.body.timesheetid],
    function (error, result) {
      if (error) {
       
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
      
        res.status(200).json({ status: true, data: result[0] });
      }
    }
  );
});

router.post("/displayprojectbyemployee", function (req, res, next) {
 
  pool.query(
    "select * from project where projectid in(select projectid from assignproject where employeeid=?)",
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
router.post("/displaytimesheetbyemployee", function (req, res, next) {
 
  pool.query(
    "select T.*,(select P.title from project P where P.projectid=T.projectid) as title ,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=?) as employeename,(select TY.typename from type TY where TY.typeid=T.typeid) as type  from timesheet T where T.employeeid=?",
    [req.body.employeeid, req.body.employeeid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
       
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.get("/displayallbydate", function (req, res) {
  pool.query(
    "select T.*,(select P.title from project P where P.projectid=T.projectid) as title,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=T.employeeid) as employeename from timesheet T where date(T.date)>=date(?) and date(T.date)<=date(?)",
    [req.body.startdate, req.body.enddate],
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
