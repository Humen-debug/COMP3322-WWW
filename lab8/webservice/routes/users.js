var express = require("express");
var router = express.Router();

// step 7.1
router.get("/get_courses", (req, res) => {
    var db = req.db;
    var col = db.get("courseList");
    col.find({}, {}).then((docs) => {
        res.json(docs);
    });
});

// step 8.1
router.delete("/delete_course/:id", (req, res) => {
    var db = req.db;
    var col = db.get("courseList");

    var course_id = req.params.id;
    col.remove({ _id: course_id }, function (err, result) {
        console.log(result);
        res.send(err === null ? "Successfully deleted!" : err);
    });
});

// step 9.1
router.put("/update_course/:id", (req, res) => {
    var db = req.db;
    var col = db.get("courseList");

    var course_id = req.params.id;
    col.update(
        { _id: course_id },
        {
            $set: {
                name: req.body.name,
                credit: req.body.credit,
                semester: req.body.semester,
            },
        },
        function (err, result) {
            res.send(
                err === null ? { msg: "Successfully updated!" } : { msg: err }
            );
        }
    );
});

// step 10.1
router.post("/add_course", (req, res) => {
    var db = req.db;
    var col = db.get("courseList");

    col.insert(req.body, function (err, result) {
        res.send(err === null ? { msg: "Successfully added!" } : { msg: err });
    });
});

module.exports = router;
