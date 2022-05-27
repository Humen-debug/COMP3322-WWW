var conn = new Mongo();

var db = conn.getDB("lab6-db");

var course_name  = ["computer network", "machine learning", "cloud computing", "system design"];
var course_semester = ["semester-1", "semester-2", "semester-1", "semester-2"];
var course_credit = ["6", "5", "4", "3"];

db.courseList.remove({});

for(let i = 0; i < course_name.length; i++) {
    db.courseList.insert(
        {'name': course_name[i],
        'semester': course_semester[i],
        'credit': course_credit[i]},
    )
}