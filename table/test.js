// Element
let container = document.querySelector(".test_container");
let action = document.querySelector('.action');

let getValues = function(timing) {

    // regex : remplace les "s" dans 2s par du vide
    // slip : transform string to array with separator
    let timingFormatted = timing.replace(/[A-Z]/gi, "").split(", ");

    // map : transform string to float
    return  timingFormatted.map((timing) => {
        return parseFloat(timing)
    });
};

let getMaxTransitionProp = function(element) {
    // window.getComputedStyle() donne la  valeur calculée finale de toutes les propriétés CSS sur un élément.
    let style = window.getComputedStyle(element);
    // les noms des propriétés CSS sur lesquelles un effet de transition devrait être appliqué.
    // La méthode split() permet de diviser une chaîne de caractères à partir d'un séparateur pour fournir un tableau de sous-chaînes.
    let props = style.transitionProperty.split(", "); // ["width", "height", "background"]

    let delays = getValues(style.transitionDelay);
    let durations = getValues(style.transitionDuration);

    // totals : durations + delays (total time)
    let totals = durations.map(function(value, index) {
        return value + delays[index];
    });

    let maxIndex = totals.reduce(function(acc, currentValue, index) {
        // acc.val < timing
        if (acc.val < currentValue) {
            // acc.val = timing
            acc.val = currentValue;
            // acc.i = index
            acc.i = index;
        }

        return acc;
    }, {val: 0, i: 0});

    return props[maxIndex.i];
};

/*let lastEventListenerFor = function(element, cb) {
    let lastProp = getMaxTransitionProp(element);
    console.log(lastProp);

    return function(e) {
        if (e.propertyName === lastProp) {
            cb(e);
        }
    };
};*/

// Callback
let cb = function(e) {
    console.log("END TRANSITION",  e);
};

let lastEventListenerFor = function(element, cb) {
    console.log(cb);
    let lastProp = getMaxTransitionProp(element);
    console.log(lastProp);

    return function(e) {
        if (e.propertyName === lastProp) {
            cb(e);
        }
    };
};

let myTransition = function(e) {
    let lastProp = getMaxTransitionProp(this);
    if (e.propertyName === lastProp) {
        console.log('Remove transition event');
        this.removeEventListener("transitionend", myTransition);
    }
};


// Event
action.addEventListener('click', () => {

    let containerClass = container.classList;
    containerClass.contains('test-on') ? containerClass.remove('test-on') : containerClass.add('test-on');
    container.addEventListener("transitionend", myTransition);
});