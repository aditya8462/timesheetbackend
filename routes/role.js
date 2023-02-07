var express = require('express');
var router = express.Router();
var pool = require("./pool")
const { v4: uuidv4 } = require('uuid');


router.post('/AddRole', function (req, res, next) {
   
    var roleid = uuidv4()
   
    pool.query("insert into roles(roleid,rolename,status)values(?,?,?)", [roleid, req.body.rolename, req.body.status], function (error, result) {
        if (error) {
           
            res.status(500).json({ status: false })
        }
        else {
           

          
            res.status(200).json({ status: true })
        }
    })
});
router.get("/displayall", function (req, res) {
    pool.query("select * from roles", function (error, result) {
        if (error) {
            res.status(500).json({ data: [], status: false })
        }
        else {
            res.status(200).json({ status: true, data: result })

        }

    })


})
router.post('/editrole', function (req, res, next) {

    pool.query("update roles set rolename=?,status=? where roleid=?", [req.body.rolename, req.body.status, req.body.roleid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, msg: 'Edited' })
        }



    })

})


router.post('/displaybyid', function (req, res, next) {

    pool.query("select * from roles where roleid=?", [req.body.roleid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, data: result[0] })
        }



    })

})



router.post('/deleterole', function (req, res, next) {

    pool.query("delete from  roles  where roleid=?", [req.body.roleid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, msg: 'Deleted' })

        }

    })

})

module.exports = router;
