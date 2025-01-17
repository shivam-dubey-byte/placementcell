window.addEventListener('wheel', function(e) {
e.preventDefault(); // This will stop scrolling
});
function hamburg(){
    const navbar = document.querySelector(".dropdown")
    navbar.style.transform = "translateY(0px)"
}

function cancel(){
    const navbar = document.querySelector(".dropdown")
    navbar.style.transform = "translateY(-500px)"
}

const text = document.querySelectorAll('label');
text.forEach(label =>{
label.innerHTML = label.textContent.split('').map((text, wave) =>
`<span style="transition-delay: ${wave * 50}ms">${text}</span>`).join('');
});

function validateForm() {
    let valid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    // Name validation
    if (name === "") {
        valid = false;
        document.getElementById('nameError').textContent = "Name is required.";
    } else {
        document.getElementById('nameError').textContent = "";
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        valid = false;
        document.getElementById('emailError').textContent = "Email is required.";
    } else if (!emailPattern.test(email)) {
        valid = false;
        document.getElementById('emailError').textContent = "Invalid email format.";
    } else {
        document.getElementById('emailError').textContent = "";
    }

    // Address validation
    if (address === "") {
        valid = false;
        document.getElementById('addressError').textContent = "Address is required.";
    } else {
        document.getElementById('addressError').textContent = "";
    }

    return valid;
}

        function toggleAnswer(element) {
            const answer = element.nextElementSibling;
            const isVisible = answer.style.display === 'block';

            if (isVisible) {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        }
        //...navbar
function hamburg(){
const navbar = document.querySelector(".dropdown")
navbar.style.transform = "translateY(0px)"
}

function cancel(){
const navbar = document.querySelector(".dropdown")
navbar.style.transform = "translateY(-500px)"
}
