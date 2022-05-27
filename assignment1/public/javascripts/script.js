function loadNewList(page_index) {
    var news = document.getElementById("news");
    var pageIndex = document.getElementById("pageIndex");
    var header = document.getElementById("header");
    clearDiv("news");
    clearDiv("pageIndex");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var json = JSON.parse(xmlhttp.responseText);
            var loginStatus = json["loginStatus"];
            var newsEntries = json["newsList"];
            
            for (i = (page_index - 1) * 5; i < (page_index - 1) * 5 + 5; i++){
                if (i >= newsEntries.length)
                    break;
                var id = newsEntries[i]["_id"];
                var headline = newsEntries[i]["headline"];
                var date = new Date(newsEntries[i]["time"]);
                
                var time = newsEntries[i]["time"].toLocaleString();
                var content = newsEntries[i]["content"];

                var div = document.createElement("div");
                div.setAttribute("class", "news_entry");
                var h = document.createElement("h1");
                var a = document.createElement("a");
                a.setAttribute("href", "/displayNewsEntry?newsID=" + id);
                a.innerHTML = headline;
                h.appendChild(a);
                div.appendChild(h);
                
                var t = document.createElement('p');
                t.innerHTML = date.toLocaleString();
                t.setAttribute('class', 'time');
                div.appendChild(t);
                var c = document.createElement("p");
                c.innerHTML = content;
                div.appendChild(c); 

                news.appendChild(div);
            }
            
            var login = document.getElementById("login");
            if (loginStatus == 0) {
                login.innerHTML = "Log in";
                login.setAttribute("href", "/login?newsID=0");
            } else {
                login.innerHTML = "Log out";
                login.onclick = logout;
            }
            header.appendChild(login);
            var length = newsEntries.length % 5 == 0 ? newsEntries.length / 5 : newsEntries.length / 5 + 1;
            for (j = 1; j <= length; j ++){
                var index = document.createElement("button");
                
                index.innerHTML = j;
                index.setAttribute("onclick", "loadNewList(" + j + ")");
                index.setAttribute("class", "inactiveIndex");
                
                if (j == page_index) {
                    index.setAttribute("class", "activeIndex");
                }
                pageIndex.appendChild(index);
                
            }
        }
    }

    var search = document.getElementById("headlines_input");

    xmlhttp.open("GET", "retrieve_news_list?search="+search.value+"&pageIndex="+pageIndex, true);
    xmlhttp.send();
}


function clearDiv(id) {
    var div = document.getElementById(id);
    while (div.firstChild) {
        div.firstChild.remove();
    }
}

function logout() {
    console.log("logout is pressed");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.response == "logout success") {
                var login = document.getElementById("login");
                login.innerHTML = "Log in";
                login.setAttribute("href", "/login?newsID=0");
                login.removeAttribute("onclick");
            }
         }
    }
    xmlhttp.open("GET", "/handleLogout", true);
    xmlhttp.send();
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "" || password == "") {
        alert("Please enter username and password");
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { 
            if (xmlhttp.response == "login success") {
                var section = document.getElementById("container");
                while (section.firstChild) {
                    section.firstChild.remove();
                }
                var message = document.createElement("h1");
                message.innerHTML = "You have successfully logged in";
                section.appendChild(message);
            } else {
                document.getElementById("message").innerHTML = "Password is incorrect";
            }
        }

    }
    xmlhttp.open("GET", "/handleLogin?username=" + username + "&password=" + password, true);
    xmlhttp.send();
}   

function postComment() {
    var new_comment = document.getElementById("comment_input");
    
    if (new_comment.value == "") {
        alert("No comment has been entered");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/handlePostComment", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    const params = new URLSearchParams(window.location.search);
    var newsID = params.get('newsID')
    var today = new Date();
    var data =
    {
        "new_comment":new_comment.value,
        "newsID": newsID,
        "time": today,
    };
    
    xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){ 
            document.getElementById("comments").innerHTML = xmlhttp.responseText + document.getElementById('comments').innerHTML;
		}
    }
    var json = JSON.stringify(data);
    new_comment.value = "";
    xmlhttp.send(json);
}



