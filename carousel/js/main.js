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
     * @param {boolean}     [options.infinite=false]
     * @param {boolean}     [options.pagination=false]
     * @param {boolean}     [options.navigation=true]
     */
    constructor(element, options) {
        // properties
        this.element = element;
        this.options = Object.assign(
            {},
            {
                slideToScroll: 1,
                slideVisible: 1,
                loop: false,
                pagination: false,
                navigation: true,
                infinite: false
            },
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
            /*this.container.appendChild(item);*/
            return item;
        });

        // Infinite
        if (this.options.infinite) {
            this.offset = this.options.slideVisible * 2 - 1;
            this.items = [
                ...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)),
                ...this.items,
                ...this.items.slice(0, this.offset).map(item => item.cloneNode(true)),
            ];
            this.goToSlide(this.offset, false);
        }

        this.items.forEach(item => this.container.appendChild(item));

        this.setStyle();
        if (this.options.navigation) {
            this.createNavigation();
        }
        if (this.options.pagination) {
            this.createPagination();
        }

        // Event
        this.moveCallbacks.forEach(cb => cb(this.currentSlide));
        this.onWindowResize(); // display mobile design on page loading
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next();
            }
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev();
            }
        });
        if (this.options.infinite) {
            this.container.addEventListener('transitionend', this.resetInfinite.bind(this));
        }
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

    createPagination() {
        let pagination = this.createDivWithClass('carousel__pagination');
        let buttons = [];
        this.root.appendChild(pagination);
        for (let i = 0; i < this.items.length; i = i + this.options.slideToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button');
            button.addEventListener('click', () => this.goToSlide(i));
            pagination.appendChild(button);
            buttons.push(button);
        }
        this.onMove(index => {
            let activeButton = buttons[Math.floor(index / this.options.slideToScroll)];
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'));
                activeButton.classList.add('carousel__pagination__button--active');
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
     * @param {number}      slide
     * @param {boolean}     [animation=true]
     */
    goToSlide(slide, animation = true) {
        console.log(slide);
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
        if (animation === false) {
            this.container.style.transition = 'none';
        }

        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.container.offsetHeight; // force repaint
        if (animation === false) {
            this.container.style.transition = '';
        }
        this.currentSlide = slide;
        this.moveCallbacks.forEach(cb => cb(slide));
    }

    /**
     * Deplace le container pour donner l'impression d'un slide infini
     */
    resetInfinite() {
        if (this.currentSlide <= this.options.slideToScroll) {
            /**
             * 1 2 3 4 5
             *
             * 3 4 5 | *[1 2] 3 4 5 | 1 2 3
             *  <-
             *  3 4 5 | 1 2 3 4 [5 | 1] 2 3
             */
            this.goToSlide(this.currentSlide + this.items.length - 2 * this.offset, false);
        }
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
        slideToScroll: 2,
        slideVisible: 2,
        loop: true,
        pagination: true
    });

    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 2,
        slideVisible: 2,
        loop: false,
        pagination: true
    });

    new Carousel(document.querySelector('#carousel3'), {
        slideToScroll: 2,
        slideVisible: 2,
        infinite: true
    });
};

if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);