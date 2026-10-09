const toggle = document.getElementById('togglePwd');
const pwd = document.getElementById('pwd');

toggle.addEventListener('click', () => {

    if (pwd.type === 'password') {

        pwd.type = 'text';
        toggle.setAttribute('aria-label', 'Hide password');

    } else {

        pwd.type = 'password';
        toggle.setAttribute('aria-label', 'Show password');

    }

});