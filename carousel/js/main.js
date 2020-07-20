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
        this.isMobile = false;

        // DOM
        this.root = this.createDivWithClass('carousel');
        this.container = this.createDivWithClass('carousel__container');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.root.setAttribute('tabindex', '0');
        this.items = children.map(child => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        this.setStyle();
        this.createNavigation();

        // Event
        this.moveCallbacks.forEach(cb => cb(0));
        this.onWindowResize(); // display mobile design on page loading
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next();
            }
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev();
            }
        })
    }

    /**
     * Dimension des items du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slideVisible;
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

            if (this.hasNextItem()) {
                nextButton.classList.add('carousel__next--hidden');
            } else {
                nextButton.classList.remove('carousel__next--hidden');
            }
        })
    }

    next() {
        this.goToSlide(this.currentSlide + this.slideToScroll);
    }

    prev() {
        this.goToSlide(this.currentSlide - this.slideToScroll);
    }

    /**
     * @param {number} slide
     */
    goToSlide(slide) {
        if (slide < 0) {
            if (this.options.loop) {
                slide = this.items.length - this.slideVisible;
            } else {
                return;
            }
        } else if (
            slide >= this.items.length ||
            (this.items[this.currentSlide + this.slideVisible] === undefined && slide > this.currentSlide)
        ) {
            if (this.options.loop) {
                slide = 0;
            } else {
                return;
            }
        }
        let translateX = slide * (-100 / this.items.length);
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentSlide = slide;

        this.moveCallbacks.forEach(cb => cb(slide));
    }


    /**
     * Looking if Carousel has next item by index
     * @returns {boolean}
     */
    hasNextItem() {
        return this.items[this.currentSlide + this.slideVisible] === undefined;
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    onWindowResize() {
        let mobile = window.innerWidth < 800;
        if (mobile !== this.isMobile) {
            this.isMobile = mobile;
            this.setStyle();
            this.moveCallbacks.forEach(cb => cb(this.currentSlide));
        }
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

    /**
     * @returns {number}
     */
    get slideToScroll() {
        return this.isMobile ? 1 : this.options.slideToScroll;
    }

    /**
     * @returns {number}
     */
    get slideVisible() {
        return this.isMobile ? 1 : this.options.slideVisible;
    }
}

let onReady = function () {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 3,
        slideVisible: 3,
        loop: true
    });

    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 2,
        slideVisible: 2,
        loop: false
    });

    new Carousel(document.querySelector('#carousel3'), {
        slideToScroll: 1,
        slideVisible: 1,
        loop: false
    });
};

if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);