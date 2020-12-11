const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

//Show input error msg
const showError = (input, msg) => {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = msg;
};

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

const checkEmail = input => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(input.value).trim())) {
        showSuccess(input);
    } else {
        showError(input, 'To nie jest adres email.')
    };
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

//Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkRequired([username, email, password, password2]);
});