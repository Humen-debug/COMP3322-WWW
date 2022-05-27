var hidden_elements = []

// Step 5. call hideContents when the page is loaded
function hideContents(){
    // elements is an array of objects of HTML elements in class "needs_login".
    var elements = Array.from(document.getElementsByClassName("needs_login"));
    
    // Step 7. call hideElement on each element in the array

    elements.forEach((e) => hideElement(e));
    

}


function hideElement(element) {
    // Step 6.1: create an object as specified in the top of this file
    //         the original display value can be obtained as
    //         element.style.display
    
     var hidden_element = {
        "element": element,
        "display": element.style.display,
     }

    // Step 6.2: push the created object into the array 'hidden_elements'
    hidden_elements.push(hidden_element);

    // hide the element by setting its display style to "none"
    element.style.display = "none";
}


function displayHiddenElements() {
    console.log("hidden_elements", hidden_elements);
    // Step 8.1: set the style.display to their original value for each element in "hidden_elements"
    hidden_elements.forEach((e) => {e.element.style.display = e.display});
    // Step 8.2: empty "hidden_elements"
    hidden_elements = [];
}


function login(){
    // Step 9.2. Implement the login function and link it to the onclick event of the "login button"
    let password = prompt("Enter password to login:");
    if (password == "comp3322") {
        displayHiddenElements();
    } else {
        alert("Login Failed");
    }


}

function formValidation(){
    // Step 10. implement form validation
    if (document.getElementById("reg_name".value)=="" || document.getElementById("reg_date").value=="") {
        alert("Please fill in your name and consultation date!");
        
        return false;
    }
    return true;

}