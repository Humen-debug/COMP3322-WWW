var conn = new Mongo();

var db = conn.getDB("lab5-db");

var students_uid = ["3412", "3412", "3412", "1234", "1234", "1234", "4321", "4321", "4321"];
var students_name = ["Alice", "Alice", "Alice", "Bob", "Bob", "Bob", "Franck", "Franck", "Franck"];
var exam_name = ["exam-1", "exam-2", "exam-3", "exam-1", "exam-2", "exam-3", "exam-1", "exam-2", "exam-3"];
var students_score = [79, 88, 86, 92, 89, 95, 79, 99, 86];

db.stuList.remove({});

for(let i = 0; i < students_uid.length; i++) {
    db.stuList.insert(
        {'uid': students_uid[i],
        'name': students_name[i],
        'exam': exam_name[i],
        'score': students_score[i]},
    )
}