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

    createHTML(parentNode) {
        const div = document.createElement("div");
    }
}