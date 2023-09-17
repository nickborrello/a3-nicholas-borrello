class contact {
    constructor(firstName, lastName, phoneNumber, streetAddress, birthday) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.streetAddress = streetAddress;
        this.birthday = birthday;
    }

    daysUntilBirthday() {
        const today = new Date();
        const daysRemaining = Math.ceil(
            (this.birthday - today) / (1000 * 60 * 60 * 24)
        );
        return daysRemaining;
    }

    createHTML(parentElement) {
        // create the div element and add it to the parent element
        const div = document.createElement("div");
        parentElement.appendChild(div);

        // add the contact information to the div
        div.innerHTML = 
        '<p>' + this.firstName + ' ' + this.lastName + '</p>' +
        '<p>' + this.phoneNumber + '</p>' +
        '<p>' + this.streetAddress + '</p>' +
        '<p>' + this.birthday + '</p>' +   
        '<p>' + this.daysUntilBirthday() + '</p>' +
        '<button type="button" class="btn btn-danger" onclick="removeContact(' + this.id + ')">Remove</button>';
    }
}