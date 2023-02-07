
var express = require('express');
var router = express.Router();
var pool = require("./pool")
const { v4: uuidv4 } = require('uuid');


router.post('/Addtype', function (req, res, next) {
  
    var typeid=uuidv4()
   
    pool.query("insert into type(typeid,typename,status)values(?,?,?)", [typeid, req.body.typename, req.body.status], function (error, result) {
        if (error) {
            
            res.status(500).json({ status: false })
        }
        else {
           

           
            res.status(200).json({ status: true })
        }
    })
});
router.get("/displayall", function (req, res) {
    pool.query("select * from type", function (error, result) {
        if (error) {
            res.status(500).json({ result: [] })
        }
        else {
            res.status(200).json({ result: result, data: result })

        }

    })


})
router.post('/edittype', function (req, res, next) {

    pool.query("update type set typename=?,status=? where typeid=?", [req.body.typename, req.body.status, req.body.typeid], function (error, result) {

        if (error) {
            
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, msg: 'Edited' })
        }



    })

})


router.post('/displaybyid', function (req, res, next) {

    pool.query("select * from type where typeid=?", [req.body.typeid], function (error, result) {

        if (error) {
            
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, data:result[0] })
        }



    })

})



router.post('/deletetype', function (req, res, next) {

    pool.query("delete from  type  where typeid=?", [req.body.typeid], function (error, result) {

        if (error) {
            
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, msg: 'Deleted' })

        }

    })

})

module.exports = router;
