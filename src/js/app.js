import {Overlay} from "./overlay";

let overlay = new Overlay();

$('.elevatable').click(function() {
    let target = this;
    let clone = $(target).clone();
    let animationConfig = {
        marginLeft: target.offsetLeft,
        marginTop: target.offsetTop - window.scrollY,
        width: target.offsetWidth
    };
    let content = clone.find('.card-content');
    clone.find('.close-overlay').click(closeListener);
    clone.css(animationConfig);
    overlay.open(clone, animationConfig, closeCallback(content, clone));
    $(content).slideDown();
    clone.animate({
        width: '50%',
        marginLeft: window.innerWidth / 4,
        marginTop: 20
    }, {duration: 500});
    clone.addClass('elevated');
});

function closeCallback(content, clone) {
    return () => {
        $(content).slideUp();
        clone.removeClass('elevated');
    }
}

function closeListener() {
    if (overlay.opened) {
        overlay.close();
    }
}