document.addEventListener('DOMContentLoaded', () => {
    //Event listeners
    inputs.forEach(input => {
        input.addEventListener('keyup', checkRequired)
        input.addEventListener('focus', movePlaceholderUp);
        input.addEventListener('blur', movePlaceholderBack);
    })

    form.addEventListener('click', checkBtnClick);
    form.addEventListener('submit', () => {
        alert('uwaga!')
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
const submitBtn = document.getElementById('submit-btn');
const passwordChecklist = form.querySelector('.password-checklist');
const passStrength = document.querySelector('#pass-strength i');
const backBtn = document.getElementById('back-btn');
const submitCheckbox = document.getElementById('submit-checkbox');

//Select input on page load
const autoFocus = input => {
    input.focus();
};

//move placeholder text up while on focus
const movePlaceholderUp = input => {
    input.target.classList.add('input-active')
};

const movePlaceholderBack = input => {
    if (input.target.value !== '') {
        return;
    }
    input.target.classList.remove('input-active');
};

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

// if you want success just add boolean TRUE as third parameter and empty string as second
const showResult = (input, msg, logic) => {
    const errorField = input.closest('.form-control').querySelector('.error-msg')
    errorField.textContent = msg;
    basicValidator(input, logic);
};

const checkLength = (input, min, max) => {
    if (input.value.length < min) {
        showResult(input, `${getFieldName(input)} must have at least ${min} characters.`)
    } else if (input.value.length >= max) {
        showResult(input, `${getFieldName(input)} can't be longer than ${max} characters.`)
    } else {
        showResult(input, '', true);
    };
};

const checkUsername = (input, min, max) => {
    const re = /^[A-Za-z0-9_-]{0,}$/;

    if (re.test(String(input.value).trim())) {
        checkLength(input, min, max)
    } else {
        showResult(input, `Only letters and numbers are allowed.`)
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
        showResult(date, `You must enter valid date.`, false);
    } else if (age < 16) {
        showResult(date, `You must be at least 16 years old, be patient. :)`, false);
    } else {
        showResult(date, '', true);
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
        showResult(password, 'Too weak', false);
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
        showResult(input1, '', true)
        return
    };
    showResult(input1, '', false);
};

const showPassword = button => {
    const showPasswordBtn = button.target.closest('span');
    const input = button.target.closest('.input-wrap').querySelector('.main-input');
    showPasswordBtn.classList.toggle('active');

    (showPasswordBtn.classList.contains('active')) ? input.setAttribute('type', 'text') : input.setAttribute('type', 'password');
};

const checkMessage = (input, min, max) => {
    const re = /^[^&[/{}$<>|]{0,}$/u;

    if (!re.test(String(input.value).trim())) {
        return showResult(input, `You can't use special characters.`, false);
    };

    checkLength(input, min, max);

};

const checkRequired = input => {
    input.preventDefault();

    const actualInput = input.target;
    const btn = input.target.closest('.form-control').querySelector('.next-page');


    if (input.key === 'Enter') {
        if (btn.classList.contains('btn-validate') && btn.id === 'message-btn') {
            return;
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

const submitForm = e => {
    e.preventDefault();
    inputs.forEach(input => {
        console.log(input.value)
    })
    form.submit();
};

const checkBtnClick = input => {
    const formControl = input.target.closest('.form-control');
    const nextPageBtn = formControl.querySelector('.next-page');

    if (input.target === submitBtn) {
        return submitForm(input);
    };

    if (submitCheckbox.checked) {
        return agreementConfirmation(submitCheckbox);
    };

    if (input.target === nextPageBtn) {
        switchPage(input);
    } else if (input.target.classList.contains('show-password')) {
        showPassword(input);
    };
};

const agreementConfirmation = (input) => {
    const button = input.closest('.form-control').querySelector('.next-page');
    input.classList.toggle('test');
    button.classList.toggle('btn-validate');
};

const switchPage = input => {
    const formControl = input.target.closest('.form-control');

    formControl.querySelector('.main-input').blur();
    formControl.nextElementSibling.classList.toggle('active');
    form.style.transform = `translateY(-${$counter.swipe += 100}%)`;
    setTimeout(() => {
        formControl.classList.toggle('active');
        autoFocus(form.querySelector(`.input${$counter.inputClassNumber++}`));
    }, 200);
};