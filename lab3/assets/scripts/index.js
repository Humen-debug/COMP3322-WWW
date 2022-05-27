var quiz_shown = false;


// Step 4: control the video
function init() {
    document.getElementById('playButtonCanvas').addEventListener('mouseenter', e => {
        playVideo();
    });
    document.getElementById('playButtonCanvas').addEventListener('mouseleave', e => {
        pauseVideo();
    });
    setInterval(tick, 20);
}

function pauseVideo() { 
    document.getElementById('lecture_video').pause();
}

function playVideo() {
    // myVideo.paused ? myVideo.play() : myVideo.pause();
    document.getElementById('lecture_video').play();
}

// Step 5: Draw the play button

function colorGradient(percentage) {
    var start_rgb = [236, 47, 75];
    var end_rgb = [0, 255, 181];
    var result_rgb = [];
    for(var i=0; i<3; i++) {
        result_rgb.push(start_rgb[i] * (1 - percentage) + end_rgb[i] * percentage);
    }
    return "rgb(" + result_rgb[0] + "," + result_rgb[1] + "," + result_rgb[2] + ")";
}

function drawArc(color, percentage) {
    var c = document.getElementById('playButtonCanvas');
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 20;
    
    ctx.arc(c.scrollHeight / 2, c.scrollWidth / 2, c.scrollWidth / 2 - 10, 0, percentage*2 * Math.PI,1);
    ctx.stroke();
    ctx.strokeStyle = color;
    
}

function tick() {
    var vid = document.getElementById('lecture_video');
    var percentage = vid.currentTime / vid.duration;

    drawArc("#AAAAAA", 1);
    var color = colorGradient(percentage);

    drawArc(color, percentage);
    vid.onended = function () { showQuiz();};
    
}

// Step 6: call the showQuiz function on video finish


function showQuiz() {
    if (!quiz_shown) {
        // Step 7: create the quiz
        var contents = document.getElementsByClassName('contents');

        var quiz_heading = document.createElement("h2");
        quiz_heading.setAttribute('id', "quiz_heading");
        quiz_heading.innerHTML = "Quiz Time"
        
        contents[0].appendChild(quiz_heading);

        var quiz_question = document.createElement("p");
        quiz_question.setAttribute('id', 'quiz_question');
        quiz_question.innerHTML = "Enter the result of the evaluating the following expression";
 
        contents[0].appendChild(quiz_question);
		
        var quiz_container = document.createElement('div');
        quiz_container.setAttribute('id', 'quiz_container');

        var question = document.createElement("p");
        question.innerHTML = "\'1\' - \'1\'";

        var quiz_answer = document.createElement('input');
        quiz_answer.setAttribute('type', 'text');
        quiz_answer.setAttribute('id', 'quiz_answer');
        
        var quiz_button = document.createElement("button");
        quiz_button.innerHTML = "Check answer";
        quiz_button.addEventListener('click', e => { checkQuizAnswer(); });
        
        quiz_container.appendChild(question);
        quiz_container.appendChild(quiz_answer);
        quiz_container.appendChild(quiz_button);

        contents[0].appendChild(quiz_container);
        quiz_shown = true;
    }
}

// Step 8: check if the answer is correct. If so, remove the quiz container and 
//         change the display texts of the created <h2> heading and quiz description <p>
function checkQuizAnswer() {
    
    if (document.getElementById("quiz_answer").value == "0") {
        var contents = document.getElementsByClassName('contents');
        contents[0].removeChild(contents[0].lastChild);
        document.getElementById('quiz_heading').innerHTML= "Quiz finished!Congratulations!";
        document.getElementById('quiz_question').innerHTML="Please proceed to study the next chapter.";
    }
}