const express = require("express");
const {check} = require("express-validator");

const messageControllers = require("../controllers/message")
const router = express.Router();
const isAuth = require("../middleware/isAuth")

router.post("",
[
    check("from","Email is invalid").isEmail().normalizeEmail().trim(),
    check("subject","Subject should be between 2 and 50 characters").isString().isLength({min:2,max : 50}),
    check("content","Content should be between 2 and 2500 characters").isString().isLength({min:2,max : 2500}),
    check("status","Invalid format").isBoolean()
],
messageControllers.createMessage);

router.get("",isAuth,messageControllers.getAllMessages);

router.get("/:id",isAuth,messageControllers.getUniqueMessage);

router.delete('/:id',isAuth,messageControllers.deleteMessage);

module.exports = router;