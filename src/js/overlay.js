export class Overlay {
    constructor() {
        this.container = $('#overlay-container');
        this.opened = false;
        this.currentChild = null;
        this.closeAnimationEnd = null;
        this.container.click((event) => {
            if ($(event.target).is('#overlay-container')) {
                this.close();
            }
        })
    }

    open(element, closeAnimationEnd, showBackdrop = true) {
        if (this.opened) {
            return;
        }
        this.closeAnimationEnd = closeAnimationEnd;
        this.currentChild = element;
        this.container.show();
        this.container.append(element);
        if (showBackdrop) {
            this.container.addClass('overlay-backdrop');
        }
        $('body').css('overflow', 'hidden');
        this.opened = true;
    }

    close() {
        if (this.opened) {
            if (this.closeAnimationEnd) {
                $(this.currentChild).animate(this.closeAnimationEnd, 500, 'swing', () => {
                    this.tearDown();
                });
            } else {
                this.tearDown();
            }
        }
    }

    tearDown() {
        this.container.hide();
        this.container.empty();
        this.opened = false;
        $('body').css('overflow', 'scroll');
    }
}