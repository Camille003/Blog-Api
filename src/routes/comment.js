const express = require("express");
const {check} = require("express-validator");

const commentControllers = require("../controllers/comment")
const router = express.Router();
const isAuth = require("../middleware/isAuth")

router.post("/",
[
    check("postId").isAlphanumeric().isLength({min:24,max:24}),
    check("from").isEmail().normalizeEmail().trim(),
    check("content").isString().isLength({min:2}).trim(),
]
,commentControllers.createComment);


module.exports = router;