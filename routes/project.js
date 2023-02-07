var express = require('express');
var router = express.Router();
var pool = require("./pool")
const { v4: uuidv4 } = require('uuid');
router.post('/AddProject', function (req, res, next) {
   
    var projectid = uuidv4()
    pool.query("insert into project(projectid,title,id,status)values(?,?,?,?)", [projectid,req.body.title,req.body.id,req.body.status ], function (error, result) {
        if (error) {
           
            res.status(500).json({ status: false })
        }
        else {
          
            res.status(200).json({ status: true })
        }
    })
});
router.get("/displayall", function (req, res) {
    pool.query("select * from project ", function (error, result) {
        if (error) {
           
            res.status(500).json({ data: [], status: false })
        }
        else {
            res.status(200).json({ status: true, data: result })
        }
    })
})
router.post('/editproject', function (req, res, next) {
    pool.query("update project set title=?,id=?,status=? where projectid=?", [req.body.title,req.body.id,req.body.status,req.body.projectid], function (error, result) {
        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            res.status(200).json({ status: true, msg: 'Edited' })
        }
    })
})
router.post('/deleteproject', function (req, res, next) {

    pool.query("delete from  project  where projectid=?", [req.body.projectid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            res.status(200).json({ status: true, msg: 'Deleted' })
        }
    })
})



router.post('/displaybyid', function (req, res, next) {

    pool.query("select * from project where projectid=?", [req.body.projectid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
          
            res.status(200).json({ status: true, data:result[0] })
        }



    })

})



module.exports = router;
