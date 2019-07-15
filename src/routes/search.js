const express = require("express");
const {check} = require("express-validator");
const search = require("../controllers/search");

const router = express.Router();


router.post("/search",
[
 check("searchTag").isString().isLength({min:2}).trim(),
 check("searchBy").isString().isLength({min:2}).trim()
],
search)



module.exports = router;