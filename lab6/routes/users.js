var express = require("express");
var router = express.Router();

// step 7.1
router.get("/get_courses", (req, res) => {
    var col = req.db.get("courseList");
    col.find().then((docs) => {
        res.json(docs);
    });
});

// step 8.1
router.delete("/delete_course/:id", (req, res) => {
    var col = req.db.get("courseList");
    col.remove({ _id: req.params.id }, function (error) {
        if (error) {
            console.log("fail");
            res.send(error);
        } else {
            console.log("success");
            res.send("Successfully Deleted!");
        }
    });
});

// step 9.1
router.put("/update_course/:id", (req, res) => {
    var col = req.db.get("courseList");
    col.update(
        { _id: req.params.id },
        {
            $set: {
                name: req.body.name,
                credit: req.body.credit,
                semester: req.body.semester,
            },
        },
        function (error) {
            if (error) {
                res.json({ msg: error });
            } else {
                res.json({ msg: "Successfully updated!" });
            }
        }
    );
});

// step 10.1
router.post("/add_course", (req, res) => {
    var col = req.db.get("courseList");
    col.insert(
        {
            name: req.body.name,
            semester: req.body.semester,
            credit: req.body.credit,
        },
        function (error) {
            if (error) {
                res.json({ msg: error });
            } else {
                res.json({ msg: "Successfully added!" });
            }
        }
    );
});

module.exports = router;
