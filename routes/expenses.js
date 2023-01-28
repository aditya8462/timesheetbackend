var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
const { v4: uuidv4 } = require("uuid");
router.post(
  "/AddExpense",
  upload.single("attachment"),
  function (req, res, next) {
    console.log(req.body);
    var expensesid = uuidv4();
    pool.query(
      "insert into expenses(expensesid,projectid,categoryid,subcategoryid,amount,description,attachment,status,employeeid,hour)values(?,?,?,?,?,?,?,?,?,?)",
      [
        expensesid,
        req.body.projectid,
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.amount,
        req.body.description,
        req.file.filename,
        0,
        req.body.employeeid,
        req.body.hour,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).json({ status: false });
        } else {
          console.log(result);
          res.status(200).json({ status: true });
        }
      }
    );
  }
);
router.get("/displayall", function (req, res) {
  pool.query(
    "select T.*,(select P.title from project P where P.projectid=T.projectid) as title,(select C.categoryname from category C where C.categoryid=T.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=T.subcategoryid) as subcategoryname,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=T.employeeid) as employeename from expenses T",

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
router.post("/editexpenses", upload.any(), function (req, res, next) {
  if (req.files.length > 0) {
    console.log("here");
    req.body.attachment = req.files[0].filename;
  }
  console.log(req.body.attachment);
  pool.query(
    "update expenses set ? where expensesid=?",
    [req.body, req.body.expensesid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        res.status(200).json({ status: true, msg: "Edited" });
      }
    }
  );
});
router.post("/deleteexpenses", function (req, res, next) {
  pool.query(
    "delete from  expenses  where expensesid=?",
    [req.body.expensesid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        res.status(200).json({ status: true, msg: "Deleted" });
      }
    }
  );
});

router.post("/displaybyexpensesid", function (req, res, next) {
  pool.query(
    "select * from expenses where expensesid=?",
    [req.body.expensesid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result[0] });
      }
    }
  );
});
router.post("/displayexpensesbyemployee", function (req, res, next) {
  // console.log(req.body)
  pool.query(
    "select T.*,(select P.title from project P where P.projectid=T.projectid) as title ,(select C.categoryname from category C where C.categoryid=T.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=T.subcategoryid) as subcategoryname,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=?) as employeename  from expenses T where T.employeeid=?",
    [req.body.employeeid, req.body.employeeid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post(
  "/editattachment",
  upload.single("icon"),
  function (req, res, next) {
    pool.query(
      "update expenses set attachment=? where expensesid=?",
      [req.file.filename, req.body.expensesid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).json({ status: false, msg: "Server Error" });
        } else {
          res.status(200).json({ status: true, msg: "Edited" });
        }
      }
    );
  }
);

router.post("/displayassignprojectbyemployee", function (req, res) {
  pool.query(
    "select P.*,(select sum(T.hours) from timesheet T where T.employeeid=? and T.projectid=P.projectid)as hours from project P where P.projectid in (select projectid from assignproject where employeeid=?)",
    [req.body.employeeid, req.body.employeeid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/displayexpensesbyproject", function (req, res) {
  pool.query(
    "select T.* ,(select P.title from project P where P.projectid=T.projectid) as title,(select C.categoryname from category C where C.categoryid=T.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=T.subcategoryid) as subcategoryname,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=T.employeeid) as employeename from expenses T  where T.projectid=? and T.employeeid=?",
    [req.body.projectid, req.body.employeeid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});

router.post("/displayexpensesbydate", function (req, res) {
  console.log(req.body);
  pool.query(
    "select T.* ,(select P.title from project P where P.projectid=T.projectid) as title,(select C.categoryname from category C where C.categoryid=T.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=T.subcategoryid) as subcategoryname,(select concat(E.firstname,E.lastname) from employee E where E.employeeid=T.employeeid) as employeename from expenses T  where T.projectid=? and T.employeeid=? and date(T.created_at)>=date(?) and date(T.created_at)<=date(?)",
    [
      req.body.projectid,
      req.body.employeeid,
      req.body.startdate,
      req.body.enddate,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: "Server Error" });
      } else {
        console.log(result);
        res.status(200).json({ status: true, data: result });
      }
    }
  );
});
module.exports = router;
