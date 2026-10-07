const toggle = document.getElementById('togglePwd');
const pwd = document.getElementById('pwd');


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

toggle.addEventListener('click', () => {

    if (pwd.type === 'password') {
        pwd.type = 'text';
        toggle.setAttribute('aria-label', 'Hide password');
    } else {
        pwd.type = 'password';
        toggle.setAttribute('aria-label', 'Show password');
    }

});


// ===============================
// LOGIN
// ===============================

// IMPORTANT:
// Do NOT use e.preventDefault() here.
//
// The form will automatically submit to:
//
// POST /login
//
// Spring Security will handle:
// username
// password
// BCrypt verification
// MySQL user lookup
// dashboard redirect