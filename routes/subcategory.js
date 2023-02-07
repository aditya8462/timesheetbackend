var express = require('express');
var router = express.Router();
var pool = require("./pool")
const { v4: uuidv4 } = require('uuid');
router.post('/AddSubCategory', function (req, res, next) {
   
    var subcategoryid=uuidv4()
   
    pool.query("insert into subcategory(subcategoryid,categoryid,subcategoryname,status)values(?,?,?,?)", [subcategoryid,req.body.categoryid, req.body.subcategoryname, req.body.status], function (error, result) {
        if (error) {
           
            res.status(500).json({ result: false })
        }
        else {
           
            res.status(200).json({ result: true })
        }
    })
});
router.get("/displayall", function (req, res) {
    pool.query("select S.*,(select C.categoryname from category C where C.categoryid=S.categoryid) as categoryname from subcategory S ", function (error, result) {
        if (error) { 
            res.status(500).json({ result: [] })
        }
        else {
            res.status(200).json({ result: result, data: result })
        }
    })
})
router.post('/editsubcategory', function (req, res, next) {

    pool.query("update subcategory set categoryid=?,subcategoryname=?,status=? where subcategoryid=?", [req.body.categoryid,req.body.subcategoryname, req.body.status, req.body.subcategoryid], function (error, result) {
        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
            res.status(200).json({ status: true, msg: 'Edited' })
        }
    })
})
router.post('/deletesubcategory', function (req, res, next) {

    pool.query("delete from  subcategory  where subcategoryid=?", [req.body.subcategoryid], function (error, result) {

        if (error) {
           
            res.status(500).json({ result: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ result: true, msg: 'Deleted' })
        }
    })
})

router.post('/displaybysubcategoryid', function (req, res, next) {

    pool.query("select * from subcategory where subcategoryid=?", [req.body.subcategoryid], function (error, result) {

        if (error) {
           
            res.status(500).json({ status: false, msg: 'Server Error' })
        }
        else {
           
            res.status(200).json({ status: true, data:result[0] })
        }



    })

})

router.post('/displaysubcategorybycategoryid', function(req,res){
    console.log(req.body)
    pool.query('select * from subcategory where categoryid=?',[req.body.categoryid], function(error, result){
        if(error){
            
            res.status(500).json([])
        }
        else{
           
            res.status(200).json({result:result})
        }
    })
})
module.exports = router;
