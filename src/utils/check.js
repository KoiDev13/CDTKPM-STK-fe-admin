export  function checkPassword (password) {
    if(/[A-Z]/g.test(password) && /[a-z]/g.test(password) && /[0-9]/g.test(password)) {
        return true;
    }
    return false;
}