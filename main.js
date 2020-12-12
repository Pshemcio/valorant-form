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
const password2 = document.getElementById('password2');
const inputs = document.querySelectorAll('.inner-wrap input');
const nextPageBtns = form.querySelectorAll('.next-page');
const pageEmail = document.querySelector('.page-email');
const dateError = document.getElementById('date-error');

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

    return input.placeholder.charAt(6).toUpperCase() + input.placeholder.slice(7);
};

const showError = (input, msg) => {
    console.log('--------------------------')
    console.log(input)
    console.log(msg)
};

const checkLength = (input, min, max) => {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} musi mieć conajmniej ${min} znaków!`)
    } else if (input.value.length >= max) {
        console.log(input)
        // showError(input, `${getFieldName(input)} nie może mieć więcej niż ${min} znaków!`)
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
    } else if (age > 130) {
        basicValidator(date, false)
        dateError.textContent = `You must enter valid date.`
    } else if (age < 16) {
        basicValidator(date, false)
        dateError.textContent = `You must be at least 16 years old, be patient. :)`
    } else {
        basicValidator(date, true)
        dateError.textContent = ``
    }
};

const switchPage = (e) => {
    const formControl = e.target.closest('.form-control');
    console.log(e.target)
    console.log(formControl)
    console.log(formControl.parentElement)
    form.style.transform = `translateY(-${$counter.swipe += 100}%)`
    setTimeout(() => {
        autoFocus(form.querySelector(`.input${$counter.inputClassNumber++}`));
    }, 500);
};

const checkRequired = input => {
    input.preventDefault();

    const btn = input.target.closest('.form-control').querySelector('.next-page');

    if (btn.classList.contains('btn-validate') && input.key === 'Enter') {
        switchPage(input);
    };

    // const actualInput = input.target.closest('form').querySelector('input');
    const actualInput = input.target;

    switch (actualInput.id) {
        case email.id:
            checkEmail(actualInput);
            break;
        case birthday.id:
            calcAge(actualInput);
            break;
        case username.id:
            checkLength(actualInput, 3, 15);
            break;
    };
};





































// TEMP DISABLED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const tempDisable = () => {
    //show success outline
    const showSuccess = input => {
        const formControl = input.parentElement;
        formControl.className = 'form-control success';
    }

    //check required
    const checkRequired = (inputArr) => {
        inputArr.forEach(input => {
            //Checks if input has value
            if (input.value.trim() === '') {
                if (input.id === 'password2') {
                    showError(input, `${getFieldName(input)}`)
                    return
                };

                showError(input, `Musisz wpisać ${getFieldName(input)}`)

            } else if (input.value.length > 0) {
                showSuccess(input);

                // final input validation
                switch (input.id) {
                    case username.id:
                        checkLength(input, 3, 15);
                        break;
                    case password.id:
                        checkLength(input, 6, 25);
                        break;
                    case email.id:
                        checkEmail(input);
                        break;
                    case password2.id:
                        checkPasswordMatch(password, input);
                        break;
                };
            };
        });
    };

    //check passwords match
    const checkPasswordMatch = (input1, input2) => {
        if (input1.value !== input2.value) {
            showError(input2, 'Hasła się nie zgadzają!')
        };
    };
};