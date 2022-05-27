// step 4.1
function findAllDocs() {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("scores_table").innerHTML = xmlhttp.responseText;
        }
    }
    console.log("load page response:",xmlhttp.responseText);

    xmlhttp.open("GET", "get_scores", true);
    xmlhttp.send();
    
    calStatistics();
}

// step 4.2
function findDocsByUID() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
            document.getElementById("scores_table").innerHTML = xmlhttp.responseText;
        }
    }
    
    var find = document.getElementById("find_input");
    

    xmlhttp.open("GET", "get_scores?find="+find.value, true);
    xmlhttp.send();

}

// step 5.1
function calStatistics(){
    var statistics = document.getElementById("statistics");
    while (statistics.firstChild) {
        statistics.firstChild.remove()
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var json = JSON.parse(xmlhttp.responseText);
        
            for (i = 0; i < json.length; i++) {
                var name = json[i]["_id"];
                var score = json[i]["avg_score"].toFixed(2);
                var a = document.createElement("p");
                a.innerHTML = "Average score of "+name+": "+score;
                document.getElementById("statistics").appendChild(a);
                
            }
        }
    }

    xmlhttp.open("GET","get_statistics",true);
    xmlhttp.send();


}

// step 6.1
function updateScore(uid, exam) {
    var xmlhttp = new XMLHttpRequest();
    
    var new_score = document.getElementById(`new_score_${uid}_${exam}`).value;
    // console.log(new_score);
    xmlhttp.open("POST", "update_score", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");

    var obj = new Object();
    obj.uid = uid;
    obj.exam = exam;
    obj.new_score = new_score;
    var jsonString = JSON.stringify(obj);
    console.log(jsonString);
    xmlhttp.send(jsonString);
    xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){ 
            alert(xmlhttp.responseText);
            findAllDocs();
		}
    }
    
}


