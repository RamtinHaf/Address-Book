const contacts = []

function createNewInputBox() {
    let template = document.querySelector("#contact-box-template .contact-box");
    let container = document.getElementById("contacts-container");
    let x = template.cloneNode(true);

    container.prepend(x);

}

function isMatch(query, contactBoxNode) {
    let name = contactBoxNode.querySelector('.contact-field.name input').value,
        email = contactBoxNode.querySelector('.contact-field.email input').value,
        phone = contactBoxNode.querySelector('.contact-field.phone input').value;

    //if (name == query || email == query || phone == query) {
    //    return true;
    //}
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    const r = new RegExp(query, "i");

    if (r.test(name) || r.test(email) || r.test(phone)) {
        return true;
    }
    return false;
}

function doFilter(el) {
    let query = el.value;

    for (let c of contacts) {
        if (isMatch(query, c) !== true) {
            c.style.display = "none";
        } else {
            c.style.display = "flex";
        }
    }

}

function addContact(event) {
    event.stopPropagation();
    event.preventDefault();

    let contactBoxNode = event.path[3];

    // 1. validate inputs of the submitted form
    // let errors = validateContactBox(contactBoxNode);
    // console.log(errors);
    // if (errors.length !== 0) {

    //     console.error("invalid form");
    //     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    //     for (let [err, el] of errors) {
    //         el.classList.add("errored") // no alert, but red borders to mark them as undone
    //     }
    //     return;
    // }
    console.log("before")
    if (validateForm(contactBoxNode)) {
        console.log("after")
            // 2. this is a new contact submission
            // 2.a. disable inputs 
        let inputs = contactBoxNode.querySelectorAll("input");

        for (let i of inputs) {
            i.setAttribute("disabled", true);
        }
        // 2.b. switch buttons
        let buttons = contactBoxNode.querySelectorAll(".action-buttons button");
        for (let b of buttons) {
            if (b.id === "add") {
                b.style.display = 'none';
            } else {
                b.style.display = 'block';
            }
        }

        // 4. create a new input form
        console.log(contactBoxNode.getAttribute("data-editing"))
        if (contactBoxNode.getAttribute("data-editing") === "true") {
            contactBoxNode.removeAttribute("data-editing")
            return;
        }

        contacts.push(contactBoxNode)
            //for (let x of contacts) {
            //    console.log(x.querySelector('.contact-field.name input').value)
            //}
        createNewInputBox()
    }

}

function editContact(event) {
    event.stopPropagation();
    event.preventDefault();
    let contactBoxNode = event.path[3];
    console.log(event.path)
    contactBoxNode.setAttribute("data-editing", true);

    // a. enable all the inputs
    let inputs = contactBoxNode.querySelectorAll("input");

    for (let i of inputs) {
        i.removeAttribute("disabled");
    }
    // b. hide edit, show save
    let buttons = contactBoxNode.querySelectorAll(".action-buttons button");
    for (let b of buttons) {
        if (b.id === "edit") {
            b.style.display = 'none';
        } else {
            b.style.display = 'block';
        }
    }
}

function deleteContact(event) {
    event.stopPropagation();
    event.preventDefault();

    let contactBoxNode = event.path[3];

    // ask for confirmation
    if (window.confirm("Are you sure you want to delete?")) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        let i = contacts.findIndex(c => c === contactBoxNode);
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        contacts.splice(i, 1);
        contactBoxNode.remove();

    }
    console.log(contacts)
}

function init() {
    createNewInputBox();

}

function validateName(name) {
    if (name == "") {
        return "name must be filled out";
    }
}

function validatePhone(phone, email) {
    if (phone == "" && email == "") {
        alert("Either Tel or Email must be filled out");
    } else if (/^\d{8}$/.test(phone) !== true) {
        return "invalid phone number";
    } else {
        return true
    }

}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) !== true) {
        return "invalid email address!";
    }
}

function validateForm(contactBoxNode) {
    let name = contactBoxNode.querySelector(".contact-field.name input");
    let email = contactBoxNode.querySelector(".contact-field.email input");
    let phone = contactBoxNode.querySelector(".contact-field.phone input");


    if (name.value == "") {
        alert("Name must be filled out");
        return false;
    }
    if (phone.value == "") {
        if (email.value == "") {
            alert("Either Tel or Email must be filled out")
            return false;
        } else if (validatePhone(phone.value)) {
            return true;
        }
    } else if (validateEmail(email.value)) {
        return true;
    }
    return true;
}

function validateContactBox(contactBoxNode) {
    let errors = [];
    if (validateForm(contactBoxNode)) {
        let name = contactBoxNode.querySelector(".contact-field.name input");
        let nameErr = validateName(name.value);
        if (nameErr !== undefined) {
            errors.push([nameErr, name])
        }
        name.classList.remove("errored");

        // let email = contactBoxNode.querySelector(".contact-field.email input");
        // let emailErr = validateEmail(email.value);
        // if (emailErr !== undefined) {

        //     errors.push([emailErr, email])
        // }
        // email.classList.remove("errored");

        let phone = contactBoxNode.querySelector(".contact-field.phone input");
        let phoneErr = validatePhone(phone.value, email.value);
        if (phoneErr !== undefined) {

            errors.push([phoneErr, phone])
        }

        phone.classList.remove("errored");


        return errors;
    }
}