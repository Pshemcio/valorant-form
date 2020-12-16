document.addEventListener('DOMContentLoaded', () => {
    //Load data
    setLang('EN');
    createNextBtns();
    createBackBtns();

    //Event listeners
    mainInputs.forEach(input => {
        // input.addEventListener('change', checkRequired);
        input.addEventListener('keyup', checkRequired);
        input.addEventListener('focus', movePlaceholderUp);
        input.addEventListener('blur', movePlaceholderBack);
    });

    birthdate.addEventListener('keyup', setBirthDate);
    birthday.addEventListener('focus', focusOnDay);
    day.addEventListener('blur', focusOnDay);
    changeLangBtn.addEventListener('click', changeLanguage);
    form.addEventListener('click', checkBtnClick);
});

//unfortunate global variables, not sure if its possible to get rid of them :)
let $scroll = 0;
let $errorLangPack = {};
let $age = [];

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const birthday = document.getElementById('birthday');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const message = document.getElementById('message');
const mainInputs = form.querySelectorAll('.main-input');
const passwordChecklist = form.querySelector('.password-checklist');
const passStrength = document.querySelector('#pass-strength i');
const formControls = document.querySelectorAll('.form-control')
const submitCheckbox = document.getElementById('submit-checkbox');
const changeLangBtn = document.getElementById('change-language');
const wrapper = document.querySelector('.wrapper');
const day = document.getElementById('day');
const birthdate = form.querySelector('.birthdate')

// Create necesarry btns!
const createBackBtns = () => {
    formControls.forEach(form => {

        if (form.classList.contains('page-email')) {
            return;
        };

        const backBtn = document.createElement('button');
        backBtn.setAttribute('type', 'button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';

        form.appendChild(backBtn);
    });
};

const createNextBtns = () => {
    formControls.forEach(form => {
        const btnId = form.classList[1].slice(5,) + '-btn';
        const nextBtn = document.createElement('button');

        nextBtn.setAttribute('type', 'button');
        nextBtn.id = btnId;
        nextBtn.className = 'next-page';
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';

        if (nextBtn.id === 'submit-btn') {
            nextBtn.textContent = 'Submit!';
        }

        form.appendChild(nextBtn);
    });
};

// allow user to change language on site
const setLang = input => {
    wrapper.id = input;
    let data = {};

    switch (input) {
        case 'EN':
            data = lang_EN;
            break;
        case 'PL':
            data = lang_PL;
    }

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const text = data[key];
            const textContent = document.querySelector(key);
            textContent.innerHTML = text;
        }
    }

    getErrorLang(input);
};

const changeLanguage = e => {
    const language = e.target.textContent.trim();
    if (language === 'EN') {
        setLang('PL');
    } else {
        setLang('EN');
    };
};

//change language of dynamically added error msgs
const getErrorLang = lang => {
    switch (lang) {
        case 'EN':
            $errorLangPack = error_EN;
            break;
        case 'PL':
            $errorLangPack = error_PL;
    };
};

const setErrorMsg = input => {
    for (const key in $errorLangPack) {
        if (Object.hasOwnProperty.call($errorLangPack, key)) {
            if (input === key) {
                return $errorLangPack[key];
            };
        };
    };
};

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
        return setErrorMsg("repeat-pass");
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
        showResult(input, `${getFieldName(input)} ${setErrorMsg("too-short")} ${min} ${setErrorMsg("characters")}.`)
    } else if (input.value.length >= max) {
        showResult(input, `${getFieldName(input)} ${setErrorMsg("too-long")} ${max} ${setErrorMsg("characters")}.`)
    } else {
        showResult(input, '', true);
    };
};

const checkUsername = (input, min, max) => {
    const re = /^[A-Za-z0-9_-]{0,}$/;

    if (re.test(String(input.value).trim())) {
        checkLength(input, min, max)
    } else {
        showResult(input, setErrorMsg("only-let-num"));
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

const setBirthDate = input => {
    const actualInput = input.target;
    // $age : tablica gdzie musisz pushować czasy
    console.log(actualInput);
};

const calcAge = date => {
    // wymagany format : "1970-01-01" ;
    const dateOfBirth = new Date(date);
    const today = new Date();
    console.log(dateOfBirth)

    const age = ((today - dateOfBirth) / 31557600000).toFixed(2);
    dateOfBirth.max = new Date().toISOString().split("T")[0];

    if (age === 'NaN') {
        return
    } else if (age > 130 || age < 2) {
        showResult(date, setErrorMsg("valid-date"), false);
    } else if (age < 16) {
        showResult(date, setErrorMsg("too-young"), false);
    } else {
        showResult(date, '', true);
    };
};

//change checklist items under password input
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
        showResult(password, setErrorMsg("weak"), false);
    } else if (hasThreeUpperCase && hasThreeNumbers) {
        passwordSuccessMsg(password, "Great", errorField, 'input-okay');
    } else {
        passwordSuccessMsg(password, "Okay", errorField, 'input-great');
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

//show password after clicking on liitle icon in the right corner of pass input
const showPassword = button => {
    const showPasswordBtn = button.target.closest('span');
    const input = button.target.closest('.input-wrap').querySelector('.main-input');
    showPasswordBtn.classList.toggle('active');

    (showPasswordBtn.classList.contains('active')) ? input.setAttribute('type', 'text') : input.setAttribute('type', 'password');
};

const checkMessage = (input, min, max) => {
    const re = /^[^&[/{}$<>|]{0,}$/u;

    if (!re.test(String(input.value).trim())) {
        return showResult(input, setErrorMsg("message"), false);
    };

    checkLength(input, min, max);

};

//check all required inputs, listener is on "keyup" !
const checkRequired = input => {
    input.preventDefault();
    const actualInput = input.target;
    const btn = input.target.closest('.form-control').querySelector('.next-page');

    if (input.key === 'Enter') {
        if (btn.classList.contains('btn-validate') && btn.id === 'message-btn') {
            return;
        } else if (btn.classList.contains('btn-validate') && btn.id === 'submit-btn') {
            return;
        } else if (btn.classList.contains('btn-validate')) {
            switchPage(input, false);
        };
    };

    switch (actualInput) {
        case email:
            checkEmail(actualInput);
            break;
        // case birthday:
        //     calcAge(actualInput);
        //     break;
        case username:
            checkUsername(actualInput, 5, 15);
            break;
        case password:
            checkPasswordMatch(confirmPassword, actualInput);
            checkPassword(actualInput, 8);
            break;
        case confirmPassword:
            checkPasswordMatch(actualInput, password);
            break;
        case message:
            checkMessage(actualInput, 5, 200);
            break;
        case submitCheckbox:
            confirmByKeySpace(input);
            break;
    };
};

const confirmByKeySpace = checkbox => {
    if (checkbox.key !== ' ') {
        return;
    };
    checkbox.target.checked === false ? checkbox.target.checked = true : checkbox.target.checked = false;

    if (submitCheckbox.checked || submitCheckbox.checked === false) {
        agreementConfirmation(submitCheckbox);
    };
};

const submitForm = e => {
    e.preventDefault();
    form.submit();
    form.reset();
};

//check which button was clicked and take accurate action
const checkBtnClick = input => {
    const formControl = input.target.closest('.form-control');
    const nextPageBtn = formControl.querySelector('.next-page');
    const backBtn = formControl.querySelector('.back-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (input.target === backBtn) {
        return switchPage(input, true);
    };

    if (input.target === submitBtn) {
        return submitForm(input);
    };

    if (submitCheckbox.checked) {
        return agreementConfirmation(submitCheckbox);
    };

    if (input.target === nextPageBtn) {
        switchPage(input, false);
    } else if (input.target.classList.contains('show-password')) {
        showPassword(input);
    };
};

const agreementConfirmation = (input) => {
    const button = input.closest('.form-control').querySelector('.next-page');
    button.classList.toggle('btn-validate');
};

//switch page up or down, if action === true => slide down else slide up
const switchPage = (input, action) => {
    const formControl = input.target.closest('.form-control');
    formControl.querySelector('.main-input').blur();
    input.target.blur();
    let direction;

    if (action) {
        submitCheckbox.checked = false;
        document.getElementById('submit-btn').classList.remove('btn-validate');
        direction = formControl.previousElementSibling;
        form.style.transform = `translateY(-${$scroll -= 100}%)`;
    } else {
        direction = formControl.nextElementSibling;
        form.style.transform = `translateY(-${$scroll += 100}%)`;
    };

    direction.classList.add('active');
    setTimeout(() => {
        formControl.classList.remove('active');
        autoFocus(direction.querySelector('.main-input'));
    }, 200);
};

const focusOnDay = input => {
    const dayInput = document.getElementById('day');
    const birthDate = document.querySelector('.birthdate')

    if (input.type === 'focus') {
        birthDate.classList.toggle('show-date');
        birthDate.classList.toggle('hide-date');
        dayInput.focus();
    } else {
        if (dayInput.value === '') {
            birthDate.classList.toggle('show-date');
            birthDate.classList.toggle('hide-date');
        };
    };
};

