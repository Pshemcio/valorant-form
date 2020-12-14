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
const message = document.getElementById('message');
const inputs = form.querySelectorAll('.main-input');
const nextPageBtns = form.querySelectorAll('.next-page');
const lastPageBtn = document.getElementById('password-btn');
const pageEmail = form.querySelector('.page-email');
const dateError = document.getElementById('date-error');
const showPassBtns = form.querySelectorAll('.show-password');
const passwordChecklist = form.querySelector('.password-checklist');
const passStrength = document.querySelector('#pass-strength i');

//Select input on page load
const autoFocus = input => {
    console.log(input)
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
    };
};

const checkUsername = (input, min, max) => {
    const re = /^[A-Za-z0-9_-]{0,}$/;

    if (re.test(String(input.value).trim())) {
        checkLength(input, min, max)
    } else {
        showError(input, `Only letters and numbers are allowed.`)
    };
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
    } else if (age > 130 || age < 2) {
        showError(date, `You must enter valid date.`);
    } else if (age < 16) {
        showError(date, `You must be at least 16 years old, be patient. :)`);
    } else {
        showSuccess(date);
    };
};

const passwordChecklistTest = (input, output) => {
    input ? output.classList.add('great') : output.classList.remove('great')
}

const passwordSuccessMsg = (input, msg, errorField, removeClass) => {
    input.classList.remove('error');
    input.classList.remove(removeClass);
    input.classList.add(`input-${msg.toLowerCase()}`);
    errorField.textContent = msg;
    errorField.className = `error-msg ${msg.toLowerCase()}`;
};

const checkPassword = (input, min) => {
    // password tests
    const errorField = input.closest('.form-control').querySelector('.error-msg');

    const inputPass = password.value.trim();
    const hasLetters = /[a-zA-Z]/.test(inputPass)
    const hasNumbers = /\d/.test(inputPass);
    const hasThreeUpperCase = /(.*[A-Z]){3,}.*/.test(inputPass);
    const hasThreeNumbers = /(.*[\d]){4,}.*/.test(inputPass);

    if (inputPass.length < min || !hasLetters || !hasNumbers) {
        input.classList.remove('input-great');
        input.classList.remove('input-okay');
        errorField.className = `error-msg`;
        showError(password, 'Too weak');
    } else if (hasThreeUpperCase && hasThreeNumbers) {
        passwordSuccessMsg(password, 'Great', errorField, 'input-okay');
    } else {
        passwordSuccessMsg(password, 'Okay', errorField, 'input-great');
    };

    passwordChecklistTest((inputPass.length >= 8), document.querySelector('#pass-length i'));
    passwordChecklistTest((hasLetters && hasNumbers && inputPass.length >= 8), passStrength);
    passwordChecklistTest((hasLetters && hasNumbers), document.querySelector('#pass-number i'));
};

const checkPasswordMatch = (input1, input2) => {
    if (input1.value === input2.value && passStrength.classList.contains('great')) {
        showSuccess(input1)
        return
    };
    showError(input1, '');
};

const showPassword = button => {
    const showPasswordBtn = button.target.closest('span');
    const input = button.target.closest('.input-wrap').querySelector('.main-input');
    showPasswordBtn.classList.toggle('active');

    (showPasswordBtn.classList.contains('active')) ? input.setAttribute('type', 'text') : input.setAttribute('type', 'password');
};

const checkMessage = (input, min, max) => {
    const re = /^[A-Za-z0-9ęóąśłżźćńĘÓĄŚŁŻŹĆŃ _,.?!()@#%*=+-/]{0,}$/u;

    if (!re.test(String(input.value).trim())) {
        return showError(input, `You can't use special characters.`);
    };

    checkLength(input, min, max);

};

const lastPageDisplay = (input) => {
    console.log(input)
}

const checkRequired = input => {
    input.preventDefault();

    const actualInput = input.target;
    const btn = input.target.closest('.form-control').querySelector('.next-page');


    if (input.key === 'Enter') {
        if (btn.classList.contains('btn-validate') && btn.classList.contains('last-page')) {
            lastPageDisplay(actualInput);
        } else if (btn.classList.contains('btn-validate')) {
            switchPage(input);
        };
    };

    switch (actualInput) {
        case email:
            checkEmail(actualInput);
            break;
        case birthday:
            calcAge(actualInput);
            break;
        case username:
            checkUsername(actualInput, 5, 15);
            break;
        case password:
            checkPassword(actualInput, 8);
            break;
        case confirmPassword:
            checkPasswordMatch(actualInput, password);
            break;
        case message:
            checkMessage(actualInput, 5, 200);
            break;
    };
};

const switchPage = (input) => {
    const formControl = input.target.closest('.form-control');
    const finalInput = formControl.querySelector('.main-input');

    if (formControl.classList.contains('page-message')) {
        return lastPageDisplay(finalInput);
    }

    input.target.closest('.form-control').querySelector('.main-input').blur();
    formControl.nextElementSibling.classList.toggle('active');
    form.style.transform = `translateY(-${$counter.swipe += 100}%)`;
    setTimeout(() => {
        formControl.classList.toggle('active');
        autoFocus(form.querySelector(`.input${$counter.inputClassNumber++}`));
    }, 200);
};