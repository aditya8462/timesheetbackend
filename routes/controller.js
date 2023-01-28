var express = require("express");
var router = express.Router();
var pool = require("./pool");
const { v4: uuidv4 } = require("uuid");

router.post("/displayall", function (req, res) {
  pool.query(
    "select * from project where projectid in (SELECT projectid FROM assignproject where employeeid in (SELECT employeeid FROM employee where controller=?))",
    [req.body.controller],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ data: [], status: false });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/displayprojecttimesheet", function (req, res) {
  pool.query(
    "select *,T.status as tstatus from timesheet T,assignproject AP,employee E where T.employeeid=AP.employeeid and T.employeeid=E.employeeid and E.controller=? and T.projectid=? group by T.timesheetid",
    [req.body.controller, req.body.projectid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ data: [], status: false });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/approvedtimesheet", function (req, res) {
  pool.query(
    "update timesheet set status=3 where timesheetid=?",
    [req.body.timesheetid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});

router.post("/nonapprovedtimesheet", function (req, res) {
  pool.query(
    "update timesheet set status=4 where timesheetid=?",
    [req.body.timesheetid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});

router.post("/displaytimesheetbydate", function (req, res) {
  pool.query(
    "select *,T.status as tstatus from timesheet T,assignproject AP,employee E where T.employeeid=AP.employeeid and T.employeeid=E.employeeid and E.controller=? and T.projectid=?  and date(T.date)>=date(?) and date(T.date)<=date(?) group by T.timesheetid",
    [
      req.body.controller,
      req.body.projectid,
      req.body.startdate,
      req.body.enddate,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ data: [], status: false });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

module.exports = router;
