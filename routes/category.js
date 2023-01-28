var express = require('express');
var router = express.Router();
var pool = require("./pool")
const { v4: uuidv4 } = require('uuid');


router.post('/AddCategory', function (req, res, next) {
    console.log(req.body)
    var categoryid=uuidv4()
    console.log(categoryid)
    pool.query("insert into category(categoryid,categoryname,status)values(?,?,?)", [categoryid, req.body.categoryname, req.body.status], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ status: false })
        }
        else {
            console.log(result)

            console.log("hjkhj", uuidv4())
            res.status(200).json({ status: true })
        }
    })
});
router.get("/displayall", function (req, res) {
    pool.query("select * from category", function (error, result) {
        if (error) {
            res.status(500).json({ result: [] })
        }
        else {
            res.status(200).json({ result: result, data: result })

        }

    })


})
router.post('/editcategory', function (req, res, next) {

    pool.query("update category set categoryname=?,status=? where categoryid=?", [req.body.categoryname, req.body.status, req.body.categoryid], function (error, result) {

        if (error) {
            console.log(error)
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            console.log(result)
            res.status(200).json({ status: true, msg: 'Edited' })
        }



    })

})


router.post('/displaybyid', function (req, res, next) {

    pool.query("select * from category where categoryid=?", [req.body.categoryid], function (error, result) {

        if (error) {
            console.log(error)
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            console.log(result)
            res.status(200).json({ status: true, data:result[0] })
        }



    })

})



router.post('/deletecategory', function (req, res, next) {

    pool.query("delete from  category  where categoryid=?", [req.body.categoryid], function (error, result) {

        if (error) {
            console.log(error)
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            console.log(result)
            res.status(200).json({ status: true, msg: 'Deleted' })

        }

    })

})

module.exports = router;
