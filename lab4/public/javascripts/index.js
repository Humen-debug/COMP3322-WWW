const { table } = require("console");

// Step 5.1
function init(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var userName = xmlhttp.response;
            
            document.getElementById("nav_guide").innerHTML = "Welcome " + userName +" !";
            
            var a = document.createElement("a");
            a.setAttribute("href", "/logout");
            a.innerHTML = " Log out";
            document.getElementById("nav_guide").appendChild(a);
        }
    }

    xmlhttp.open('GET', 'courses/get_user', true);
    xmlhttp.send();

    // show all courses
    showAllCourses();
    
}

// Step 6.1
function showAllCourses(){
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
            document.getElementById("course_table").innerHTML = xmlhttp.responseText;
        }
    }

    xmlhttp.open('GET', 'courses/get_courses', true);
    xmlhttp.send();

}


function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev){
    ev.preventDefault();
}

// Step 7.2
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.value=data;

}


// Step 7.3
function enrollCourse() {
    var xmlhttp = new XMLHttpRequest();
    var code = document.getElementById("enroll_course").value;
    
    xmlhttp.open("POST", "courses/enroll", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("code=" + code);
    xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){ 
            alert(xmlhttp.responseText);
		}
    }
    showAllCourses();
}