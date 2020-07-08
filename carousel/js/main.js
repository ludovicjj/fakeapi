class Carousel {

    /**
     * This callback is displayed as a global member.
     * @callback moveCallback
     * @param {number} slide
     */

    /**
     * @param {HTMLElement} element
     * @param {Object}      options
     * @param {number}      [options.slideToScroll=1]
     * @param {number}      [options.slideVisible=1]
     * @param {boolean}     [options.loop=false]
     */
    constructor(element, options) {
        // properties
        this.element = element;
        this.options = Object.assign(
            {},
            {slideToScroll: 1, slideVisible: 1, loop: false},
            options,
        );
        let children = [].slice.call(element.children);
        this.currentSlide = 0;
        this.moveCallbacks = [];

        // DOM
        this.root = this.createDivWithClass('carousel');
        this.container = this.createDivWithClass('carousel__container');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);

        this.items = children.map(child => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });

        // Method
        this.setStyle();
        this.createNavigation();
        this.moveCallbacks.forEach(cb => cb(0));
    }

    /**
     * Dimension des items du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.options.slideVisible;
        this.container.style.width = ratio * 100 + '%';
        this.items.forEach(item => item.style.width = 100 / this.items.length + '%');
    }

    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next');
        let prevButton = this.createDivWithClass('carousel__prev');
        this.root.appendChild(nextButton);
        this.root.appendChild(prevButton);
        nextButton.addEventListener('click', this.next.bind(this));
        prevButton.addEventListener('click', this.prev.bind(this));

        if (this.options.loop === true) {
            return;
        }
        this.onMove(slide => {
            if (slide === 0) {
                prevButton.classList.add('carousel__prev--hidden');
            } else {
                prevButton.classList.remove('carousel__prev--hidden');
            }

            if (this.hasItem()) {
                nextButton.classList.add('carousel__next--hidden');
            } else {
                nextButton.classList.remove('carousel__next--hidden');
            }
        })
    }

    next() {
        this.goToSlide(this.currentSlide + this.options.slideToScroll);
    }

    prev() {
        this.goToSlide(this.currentSlide - this.options.slideToScroll);
    }

    /**
     * @param {number} slide
     */
    goToSlide(slide) {
        if (slide < 0) {
            slide = this.items.length - this.options.slideVisible;
        } else if (
            slide >= this.items.length || this.isOverLimit(slide)
        ) {
            slide = 0;
        }
        let translateX = slide * (-100 / this.items.length);
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentSlide = slide;

        this.moveCallbacks.forEach(cb => cb(slide));
    }

    /**
     * confirm carousel is over the limit
     * @param {number} slide
     * @returns {boolean}
     */
    isOverLimit(slide) {
        let index = this.currentSlide + this.options.slideVisible;
        return this.items[index] === undefined && slide > this.items.length - this.options.slideVisible;
    }

    /**
     * confirm item exist by index
     * @returns {boolean}
     */
    hasItem() {
        return this.items[this.currentSlide + this.options.slideVisible] === undefined;
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    /**
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        return div;
    }
}

let onReady = function () {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 1,
        slideVisible: 3
    });

    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 2,
        slideVisible: 2,
        loop: true
    });
};

if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);