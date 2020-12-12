document.addEventListener('DOMContentLoaded', () => {
    //Event listeners
    inputs.forEach(input => {
        input.addEventListener('keyup', checkRequired)
        input.addEventListener('focus', movePlaceholderUp);
        input.addEventListener('blur', movePlaceholderBack);
    })

    nextPageBtns.forEach(button => {
        button.addEventListener('click', switchPage);
    });

    showPassBtns.forEach(button => {
        button.addEventListener('click', showPassword);
    })

    autoFocus(email);
});

let $counter = {
    inputClassNumber: 2,
    swipe: 0
};

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const birthday = document.getElementById('birthday');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const inputs = form.querySelectorAll('.inner-wrap input');
const nextPageBtns = form.querySelectorAll('.next-page');
const pageEmail = form.querySelector('.page-email');
const dateError = document.getElementById('date-error');
const showPassBtns = form.querySelectorAll('.show-password');

//Select input on page load
const autoFocus = input => {
    input.focus();
}

//move placeholder text up while on focus
const movePlaceholderUp = input => {
    input.target.classList.add('input-active')
}

const movePlaceholderBack = input => {
    if (input.target.value !== '') {
        return;
    }
    input.target.classList.remove('input-active');
}

//change input color and next-button event in case succes/error
const basicValidator = (input, action) => {
    const button = input.closest('.form-control').querySelector('.next-page');

    if (action) {
        input.classList.remove('error');
        button.classList.add('btn-validate')
    } else {
        input.classList.add('error')
        button.classList.remove('btn-validate')
    };
};

const getFieldName = (input) => {
    if (input.id === 'password2') {
        return 'Musisz powtórzyć hasło'
    };

    const txt = input.closest('.form-control').querySelector('.js-label').textContent.toLowerCase();

    return txt.charAt(0).toUpperCase() + txt.slice(1);
};

const showError = (input, msg) => {
    const errorField = input.closest('.form-control').querySelector('.error-msg')
    errorField.textContent = msg;
    basicValidator(input, false);
};

const showSuccess = input => {
    const errorField = input.closest('.form-control').querySelector('.error-msg')
    errorField.textContent = '';
    basicValidator(input, true);
};

const checkLength = (input, min, max) => {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must have at least ${min} characters.`)
    } else if (input.value.length >= max) {
        showError(input, `${getFieldName(input)} can't be longer than ${max} characters.`)
    } else {
        showSuccess(input);
    }
};

const checkEmail = input => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(input.value).trim())) {
        basicValidator(input, true);
    }
    else {
        basicValidator(input, false);
    };
};

const calcAge = date => {
    const birthday = new Date(date.value);
    const today = new Date();

    const age = ((today - birthday) / 31557600000).toFixed(2);
    birthday.max = new Date().toISOString().split("T")[0];

    if (age === 'NaN') {
        return
    } else if (age > 130) {
        showError(date, `You must enter valid date.`);
    } else if (age < 16) {
        showError(date, `You must be at least 16 years old, be patient. :)`);
    } else {
        showSuccess(date);
    }
};

const switchPage = (e) => {
    const mainInput = e.target.closest('.form-control').querySelector('.main-input');
    mainInput.blur();
    form.style.transform = `translateY(-${$counter.swipe += 100}%)`;

    setTimeout(() => {
        autoFocus(form.querySelector(`.input${$counter.inputClassNumber++}`));
    }, 500);
};

const checkPassword = (input, min, max) => {
    // password tests
    const button = input.closest('.form-control').querySelector('.next-page');

    const inputPass = password.value.trim();
    const hasUpperCase = /[A-Z]/.test(inputPass);
    const hasNumbers = /\d/.test(inputPass);
    const hasThreeUpperCase = /(.*[A-Z]){3,}.*/.test(inputPass);

    if (!hasUpperCase) {
        showError(password, 'At least one uppercase letter.')
    } else if (!hasNumbers) {
        showError(password, 'At least one number.')
    } else if (!hasThreeUpperCase) {
        showError(password, 'At least THREE numbers.')
    }
    else {
        checkLength(input, min, max);
        if (button.classList.contains('btn-validate')) {
            checkPasswordMatch(confirmPassword, input);
        }
    };
};

const checkPasswordMatch = (input1, input2) => {
    if (input1.value === input2.value) {
        showSuccess(input1)
        return
    };
    showError(input1, '');
};

const checkRequired = input => {
    input.preventDefault();

    const btn = input.target.closest('.form-control').querySelector('.next-page');

    if (btn.classList.contains('btn-validate') && input.key === 'Enter') {
        switchPage(input);
    };

    const actualInput = input.target;

    switch (actualInput.id) {
        case email.id:
            checkEmail(actualInput);
            break;
        case birthday.id:
            calcAge(actualInput);
            break;
        case username.id:
            checkLength(actualInput, 5, 15);
            break;
        case password.id:
            checkPassword(actualInput, 8, 40);
            break;
        case confirmPassword.id:
            checkPasswordMatch(actualInput, password);
            break;
    };
};

const showPassword = button => {
    const wholeBtn = button.target.closest('span');
    const input = button.target.closest('.input-wrap').querySelector('.main-input');
    wholeBtn.classList.toggle('active');

    (wholeBtn.classList.contains('active')) ? input.setAttribute('type', 'text') : input.setAttribute('type', 'password');
};