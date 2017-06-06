import {Overlay} from "./overlay";

let overlay = new Overlay();

$('.elevatable').click(function (event) {
    let target = this;
    let clone = $(target).clone();
    //clone.addClass('before-elevate');
    let animationConfig = {
        marginLeft: target.offsetLeft,
        marginTop: target.offsetTop - window.scrollY,
        width: target.offsetWidth
    };
    clone.css(animationConfig);
    overlay.open(clone, animationConfig);
    clone.animate({
        width: '50%',
        marginLeft: window.innerWidth / 4,
        marginTop: 20
    }, {duration: 500});
});