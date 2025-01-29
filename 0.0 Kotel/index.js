
document.querySelectorAll(".btn-up").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        buttonAnimation(target);
        changeValue(target);
    });
});

document.querySelectorAll(".btn-down").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        buttonAnimation(target);
        changeValue(target);
    });
});

function changeValue(pressedButton) {
    const container = pressedButton.parentElement.parentElement;
    const valueElement = container.querySelector("p > span")
    const openInterval = valueElement.innerHTML;
    let openIntervalNum = Number(openInterval);

    const isLower = pressedButton.classList.contains("btn-down");

    if (isLower) {
        if (openIntervalNum > 1) {
            openIntervalNum -= 1;
            valueElement.innerHTML = openIntervalNum;
        }
    }
    else {
        if (openIntervalNum < 9) {
            openIntervalNum += 1;
            valueElement.innerHTML = openIntervalNum;
        }
    }
}

function buttonAnimation(pressedButton) {
    pressedButton.classList.add("pressed");

    setTimeout(function() {
        pressedButton.classList.remove("pressed");
    }, 100, );
}