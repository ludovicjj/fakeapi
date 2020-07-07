class Carousel {
    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {number} options.slideToScroll
     * @param {number} options.slideVisible
     */
    constructor(element, options) {
        // properties
        this.element = element;
        this.options = Object.assign({}, {slideToScroll: 1, slideVisible: 1}, options);
        let children = [].slice.call(element.children);
        this.currentSlide = 0;

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
        this.createNavigation()
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
        let translateX = slide * (-100 / this.items.length);
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentSlide = slide;
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
        slideToScroll: 1,
        slideVisible: 1
    });
};

if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);