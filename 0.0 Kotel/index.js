


document.querySelectorAll(".btn-up").forEach(function(pressedButton) {
    pressedButton.addEventListener("click", function() {
        console.log(this);
        buttonAnimation(this);
        raiseValue(this);
    });
});

document.querySelector("#check-interval .btn-down").addEventListener("click", function() {
    buttonAnimation(this);
    lowerValue("#check-interval");
});

document.querySelector("#check-interval .btn-down").addEventListener("click", function() {
    buttonAnimation(this);
    lowerValue("#check-interval");
});


document.querySelector("#open-interval .btn-down").addEventListener("click", function() {
    buttonAnimation(this);
    lowerValue("#open-interval");
});

function raiseValue(pressedButton) {
    const container = pressedButton.parentElement.parentElement;
    const valueElement = container.querySelector("p > span")
    const openInterval = valueElement.innerHTML;
    let openIntervalNum = Number(openInterval);
    if (openIntervalNum < 9) {
        openIntervalNum += 1;
        valueElement.innerHTML = openIntervalNum;
    }
}

function lowerValue(pressedButton) {
    openInterval = document.querySelector(pressedButton + " > p > span").innerHTML;
    openIntervalNum = Number(openInterval);
    if (openIntervalNum > 1) {
        openIntervalNum -= 1;
        document.querySelector(pressedButton + " > p > span").innerHTML = openIntervalNum;
    }
}

function buttonAnimation(pressedButton) {
    pressedButton.classList.add("pressed");

    setTimeout(function() {
        pressedButton.classList.remove("pressed");
    }, 100, );
}