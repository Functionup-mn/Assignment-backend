

const isValidEmail = function ( value ){
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/; 

    if(emailRegex.test(value)) return true;
}

const isValidPassword = function (pass) {
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;

    if(passRegex.test(pass)) return true;
}

const isValidPhone = function (value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[0-9]{10}$/))
}

module.exports = {isValidEmail, isValidPassword, isValidPhone}