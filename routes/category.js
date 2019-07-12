const express = require("express");
const {check} = require("express-validator");

const categoryControllers = require("../controllers/category")
const isAuth = require("../middleware/isAuth")

const router = express.Router();

router.post("",isAuth,
[
 check("tags").isString().isLength({min : 2}),
 check("title","Title Should be between 5 and 25 characters").isString().isLength({min:5 ,max : 25}).trim(),
 check("description","Description Should be between 5 and 50 characters").isString().isLength({min:5,max : 50}).trim(),
],
categoryControllers.createCategory);

router.get("",isAuth,categoryControllers.getAllCategories);

router.get("/:id",isAuth,categoryControllers.getUniqueCategory);

router.patch("/id",
isAuth,
[
    check("title","Title Should be between 5 and 25 characters").isString().isLength({min:5 ,max : 25}).trim(),
    check("description","Description Should be between 5 and 50 characters").isString().isLength({min:5,max : 50}).trim(),
]
,categoryControllers.updateCategory);

router.delete("/:id",isAuth,categoryControllers.deleteCategory)

module.exports = router;


