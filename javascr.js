var navig = document.querySelector('nav');

window.addEventListener('scroll', function () {
    if(window.pageYOffset > 50) {
        navig.classList.add('bg-dark');
    } else {
        navig.classList.remove('bg-dark');
    }
});


window.addEventListener('scroll', () => {
    scrollFunctionTop();
});

//Get the buttons

let myButton = document.getElementById("btn-back-to-top");
let myButtonDos = document.querySelector('.btn-return')

// When the user scrolls down 20px from the top of the document, show the button

function scrollFunctionTop() {
    if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
    ) {
    myButton.style.display = "block";
    myButtonDos.style.display = "none"
    } else {
    myButton.style.display = "none";
    myButtonDos.style.display = "block"
    }
}


// When the user clicks on the button, scroll to the top of the document
myButton.addEventListener("click", backToTop);

function backToTop() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
}


// When the user clicks on the button, return to the previous page
myButtonDos.addEventListener('click', () => {
    window.history.back();
})
