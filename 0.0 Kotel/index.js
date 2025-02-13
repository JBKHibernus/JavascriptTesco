"use strict"

document.querySelectorAll(".btn-up").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        animateButton(target);
        changeValue(target);
    });
});

document.querySelectorAll(".btn-down").forEach((pressedButton) => {
    pressedButton.addEventListener("click", (event) => {
        const target = event.currentTarget;
        animateButton(target);
        changeValue(target);
    });
});

function changeValue(pressedButton) {
    const container = pressedButton.parentElement.parentElement;
    const valueElement = container.querySelector("p > span")
    let currentValue = Number(valueElement.innerHTML);

    const isLower = pressedButton.classList.contains("btn-down");
    const changeBy = isLower ? -1 : +1;

    valueElement.innerHTML = getUpdatedValue(currentValue, changeBy);
}

function getUpdatedValue(currentValue, changeBy) {
    let updatedValue = currentValue + changeBy;
    
    updatedValue = Math.min(9, updatedValue);
    updatedValue = Math.max(1, updatedValue);

    return updatedValue;
}

function animateButton(pressedButton) {
    pressedButton.classList.add("pressed");

    setTimeout(function() {
        pressedButton.classList.remove("pressed");
    }, 100, );
}

