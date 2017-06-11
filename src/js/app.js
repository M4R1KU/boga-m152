import {Overlay} from "./overlay";
import {extractImageData} from "./exif";

let overlay = new Overlay();

$('.elevatable').click(function () {
    let target = this;
    let clone = $(target).clone();
    let animationConfig = {
        marginLeft: target.offsetLeft,
        marginTop: target.offsetTop - window.scrollY,
        width: target.offsetWidth
    };
    let content = clone.find('.card-content');
    showImageData(content, clone.find('img'), function () {
        clone.find('.close-overlay').click(closeListener);
        clone.css(animationConfig);

        overlay.open(clone, animationConfig, closeCallback(content, clone));

        $(content).slideDown(500);
        clone.animate({
            width: '50%',
            marginLeft: window.innerWidth / 4,
            marginTop: 20
        }, {duration: 500});
        clone.addClass('elevated');
    });
});

function showImageData(container, image, callback) {
    let result = extractImageData(image, function (exifData) {
        let template = `<div class="row">
                ${exifData.map(tag => `
                    <div class="col s12 m6">
                        <i class="material-icons">${tag.icon}</i>
                        <span>${tag.displayName}: </span>
                        <span>${tag.value}</span>
                    </div>
                `).join('')}
            </div>`;
        $(container).find('.exif-data').append(template);
    });
    if (!result) {
        $(container).find('.exif-data').append(`<span>Failed to load EXIF data. Try again.</span>`);
    }
    callback.call();
}

function closeCallback(content, clone) {
    return () => {
        $(content).slideUp(500);
        clone.removeClass('elevated');
    }
}

function closeListener() {
    if (overlay.opened) {
        overlay.close();
    }
}