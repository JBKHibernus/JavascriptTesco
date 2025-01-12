


document.querySelector("#check-interval .btn-up").addEventListener("click", function() {
    buttonAnimation(this);
    raiseValue("#check-interval");
});

document.querySelector("#check-interval .btn-down").addEventListener("click", function() {
    buttonAnimation(this);
    lowerValue("#check-interval");
});

document.querySelector("#open-interval .btn-up").addEventListener("click", function() {
    buttonAnimation(this);
    raiseValue("#open-interval");
});

document.querySelector("#open-interval .btn-down").addEventListener("click", function() {
    buttonAnimation(this);
    lowerValue("#open-interval");
});

function raiseValue(pressedButton) {
    openInterval = document.querySelector(pressedButton + " > p > span").innerHTML;
    openIntervalNum = Number(openInterval);
    if (openIntervalNum < 9) {
        openIntervalNum += 1;
        document.querySelector(pressedButton + " > p > span").innerHTML = openIntervalNum;
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