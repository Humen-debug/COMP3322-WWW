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
    courses_list = [];
    $.getJSON("/users/get_courses", function (data) {
        $.each(data, function (key, val) {
            courses_list.push(val);
            var td = `<tr><td>${val["name"]}</td>
            <td>${val["credit"]}</td>
            <td>${val["semester"]}</td>
            <td><a href="#" class="linkDelete" rel=${val["_id"]}>Delete</a></td>
            </tr>`;
            console.log(td);
            table_content += td;
        });
        $("#course_table").html(table_content);
    });
}

$("#course_table").on("click", ".linkDelete", deleteCourse);

// step 8.2
function deleteCourse(event) {
    event.preventDefault();
    var _id = $(this).attr("rel");

    $.ajax({
        url: "/users/delete_course/" + _id,
        type: "DELETE",

        success: function (response) {
            console.log(response);
            alert(response);
            showAllCourses();
        },
        error: function (error) {
            console.log(error);
            alert(error);
        },
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
            console.log(id);
            $.ajax({
                url: "/users/update_course/" + id,
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(new_doc),
                success: function (data) {
                    console.log(data);
                    alert(data["msg"]);
                    showAllCourses();
                },
                error: function (error) {
                    alert(error["msg"]);
                },
            });
        } else {
            // step 10.2 course doesn't exist - add
            $.ajax({
                url: "/users/add_course",
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(new_doc),
                success: function (data) {
                    console.log(data);
                    alert(data["msg"]);
                    showAllCourses();
                },
                error: function (error) {
                    alert(error["msg"]);
                },
            });
        }
    } else alert("Please fill in all fields.");
}
