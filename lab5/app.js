/* =============  DO NOT MODIFY ============>> */

var express = require('express');
var app = express();

app.use(express.json());

var monk = require('monk');
var db = monk('127.0.0.1:27017/lab5-db');

app.use(express.static('public'), function(req,res,next){	
    req.db = db;
    next();
})

function renderHTML(docs){
    var response = `
        <tr><th>Student UID</th>
        <th>Student Name</th>
        <th>Exam Name</th>
        <th>Score</th>
        <th>Update Score</th>
    ` 

    for (var i = 0; i < docs.length; i++){
        var doc = docs[i];
        var td = `
            <tr><td>${doc.uid}</td>
            <td>${doc.name}</td>
            <td>${doc.exam}</td>
            <td>${doc.score}</td>
            <td>
                <input id="new_score_${doc.uid}_${doc.exam}" type="text"> 
                <button onclick="updateScore('${doc.uid}', '${doc.exam}')">
                    Update
                </button>
            </td></tr>
        `
        response += td;
    }

    return response
}

app.get('/', (req, res) => {    
    res.sendFile( __dirname + "/public/" + "scores.html" );
});

/* <<============  DO NOT MODIFY ============= */


// step 4.3
app.get('/get_scores', (req, res) => {    
    var find_value = req.query.find;
    var db = req.db;
    var col = db.get("stuList");
    
    if (find_value == null || find_value == "") {
        col.find({}, { sort: { uid: 1 } }).then((docs) => { res.send(renderHTML(docs));});
    }
    else {
        col.find({uid: find_value}, {sort: {score: -1}}).then((docs) => { res.send(renderHTML(docs));});
    }

});


// step 5.2
app.get('/get_statistics', (req, res) => {    
    var db = req.db;
    var col = db.get("stuList");
    col.aggregate([
        {
            $group: {
                _id: "$name",
                avg_score: { $avg: "$score" }
            }
        },
        {
            $sort: { avg_score: -1 }
        }
    ]).then((result) => {
        console.log(JSON.stringify(result));
        res.json(result);	        
    });
    						
    // res.json(result);

});


// step 6.2
app.post('/update_score', (req, res) => {

    var uid = req.body.uid;
    var exam = req.body.exam;
    var new_score = parseInt(req.body.new_score);
    
    // console.log("new score",new_score);
    if (isNaN(new_score) || new_score < 0 || new_score > 100) 
		res.send("Invalid Score!");
    else{
        var db = req.db;
        var col = db.get("stuList");
        col.update({ uid: uid, exam: exam }, { $set: { 'score': new_score } }).then(res.send("Successfully updated!")).catch(console.error);

    }
});


// launch the server with port 8081
var server = app.listen(8081, () => {
	var host = server.address().address
	var port = server.address().port
	console.log("lab5 app listening at http://%s:%s", host, port)
});

