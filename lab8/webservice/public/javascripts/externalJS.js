/* =============  DO NOT MODIFY ============>> */

$(document).ready(function () {
    showAllCourses();
});

// store courses locally obtained from server
var courses_list = [];

// check whether input boxes are filled
function isInputFilled() {
    var checked = true;
    $("#update_form input").each(function () {
        if ($(this).val() == "") checked = false;
    });
    return checked;
}

/* <<=============  DO NOT MODIFY ============ */

// step 7.2
function showAllCourses() {
    var table_content = `
        <tr><th>Course Name</th>
        <th>Credit</th>
        <th>Semester</th>
        <th>Action</th>
    `;

    $.getJSON("/users/get_courses", function (docs) {
        courses_list = docs;
        $.each(docs, function () {
            table_content += `
                <tr><td>${this.name}</td>
                <td>${this.credit}</td>
                <td>${this.semester}</td>
                <td><a href="#" class="linkDelete" rel="${this._id}">Delete</td>
            `;
        });

        $("#course_table").html(table_content);
    });
}

$("#course_table").on("click", ".linkDelete", deleteCourse);

//step 8.2
function deleteCourse(event) {
    event.preventDefault();

    var id = $(this).attr("rel");

    $.ajax({
        type: "DELETE",
        url: "/users/delete_course/" + id,
    }).done(function (msg) {
        alert(msg);
        showAllCourses();
    });
}

$("#submitCourse").on("click", addOrUpdateCourse);

function addOrUpdateCourse(event) {
    event.preventDefault();

    if (isInputFilled()) {
        var name = $("#inputName").val();
        var new_doc = {
            name: name,
            credit: $("#inputCredit").val(),
            semester: $("#inputSemester").val(),
        };

        var names = courses_list.map(function (elem) {
            return elem.name;
        });
        var index = names.indexOf(name);
        if (index != -1) {
            // step 9.2 course exists - do update
            var id = courses_list[index]._id;
            $.ajax({
                type: "PUT",
                url: "/users/update_course/" + id,
                data: new_doc,
                dataType: "JSON",
            }).done(function (response) {
                alert(response.msg);
                showAllCourses();
            });
        } else {
            // step 10.2 course doesn't exist - add
            $.ajax({
                type: "POST",
                url: "/users/add_course",
                data: new_doc,
                dataType: "JSON",
            }).done(function (response) {
                alert(response.msg);
                showAllCourses();
            });
        }
    } else alert("Please fill in all fields.");
}
