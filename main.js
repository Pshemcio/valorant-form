document.addEventListener('DOMContentLoaded', () => {
    //Event listeners

    // form.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     checkRequired([email, username, password, password2]);
    // });

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

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const birthday = document.getElementById('birthday');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const inputs = document.querySelectorAll('.inner-wrap input');
const nextPageBtns = document.querySelectorAll('.next-page');
const pageEmail = document.querySelector('.page-email');

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
    const button = input.closest('form').querySelector('.next-page');

    if (action) {
        input.classList.remove('error');
        button.classList.add('btn-validate')
    } else {
        input.classList.add('error')
        button.classList.remove('btn-validate')
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

const checkDate = e => {
    console.log(e.value)
}

const checkRequired = input => {
    input.preventDefault();
    // const actualInput = input.target.closest('form').querySelector('input');
    const actualInput = input.target;

    // console.log(actualInput);
    console.log(actualInput.value)

    switch (actualInput.id) {
        case email.id:
            checkEmail(actualInput);
            break;
        case birthday.id:
            checkDate(actualInput);
            break;
        case username.id:
            checkLength(input, 3, 15);
            break;
        // case password2.id:
        //     checkPasswordMatch(password, input);
        //     break;
    };

    // checkEmail(actualInput);
};

const checkLength = (e) => {
    console.log(e.target)
}



let test = 0;

const switchPage = button => {
    button.preventDefault();
    form.style.transform = `translateY(-${test += 100}%)`
    console.log(button.target)
    setTimeout(() => {
        autoFocus(birthday);
    }, 400);
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

    const getFieldName = (input) => {
        if (input.id === 'password2') {
            return 'Musisz powtórzyć hasło'
        };

        return input.placeholder.charAt(6).toUpperCase() + input.placeholder.slice(7);
    };

    //check input length
    const checkLength = (input, min, max) => {
        if (input.value.length < min) {
            showError(input, `${getFieldName(input)} musi mieć conajmniej ${min} znaków!`)
        } else if (input.value.length >= max) {
            showError(input, `${getFieldName(input)} nie może mieć więcej niż ${min} znaków!`)
        };
    };
}