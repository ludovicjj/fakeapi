class CarouselTouchPlugin {
    /**
     * @param {Carousel} carousel
     */
    constructor(carousel) {
        // cancel drag html element
        carousel.container.addEventListener('dragstart', e => e.preventDefault());
        carousel.container.addEventListener('mousedown', this.starDrag.bind(this));
        carousel.container.addEventListener('touchstart', this.starDrag.bind(this), {passive: true});
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('touchmove', this.drag.bind(this));
        window.addEventListener('mouseup', this.endDrag.bind(this));
        window.addEventListener('touchend', this.endDrag.bind(this));
        window.addEventListener('touchcancel', this.endDrag.bind(this));
        this.carousel = carousel;
    }

    /**
     * Demarrre le déplacement au toucher
     * @param {MouseEvent|TouchEvent} e
     */
    starDrag(e) {
        if (e.touches) {
            if (e.touches.length > 1) {
                return;
            } else {
                e = e.touches[0];
            }
        }
        this.origin = {x: e.screenX, y: e.screenY};
        this.width = this.carousel.containerWidth;
        this.carousel.disableTransition();
    }

    /**
     * @param {MouseEvent|TouchEvent} e
     */
    drag(e) {
        if (this.origin) {
            let point = e.touches ? e.touches[0] : e;
            let translate = {x: point.screenX - this.origin.x, y: point.screenY - this.origin.y};
            /*if (e.touches && Math.abs(translate.x) > Math.abs(translate.y)) {
                e.preventDefault();
                e.stopPropagation();
            }*/
            let baseTranslate = this.carousel.currentSlide * -100 / this.carousel.items.length;
            this.lastTranslate = translate;
            this.carousel.translate(baseTranslate + 100 * translate.x / this.width);
        }
    }

    /**
     * Fin du déplacement
     * @param {MouseEvent|TouchEvent} e
     */
    endDrag(e) {
        if (this.origin && this.lastTranslate) {
            this.carousel.enableTransition();
            if (Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) > 0.2) {
                if (this.lastTranslate.x < 0) {
                    this.carousel.next();
                } else {
                    this.carousel.prev();
                }
            } else {
                this.carousel.goToSlide(this.carousel.currentSlide);
            }
        }
        this.origin = null;
    }
}

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
        this.offset = 0;

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
            /*this.offset = this.options.slideVisible * 2 - 1;*/
            this.offset = this.options.slideVisible + this.options.slideToScroll - 1;
            if (this.offset > children.length) {
                console.error("Vous n'avez pas assez d'element dans le carousel", element)
            }
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

        // Plugin
        new CarouselTouchPlugin(this);
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

        let items = this.items.length - (2 * this.offset);
        let itemsNotVisible = items - this.options.slideVisible;
        let page = Math.ceil(((itemsNotVisible) / this.options.slideToScroll)) +1;


        /*for (let i = 0; i <= (this.items.length - (2 * this.offset)); i = i + this.options.slideToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button');
            button.addEventListener('click', () => this.goToSlide(i + this.offset));
            pagination.appendChild(button);
            buttons.push(button);
        }*/

        // Test loop
        for (let i = 0; i < page; i++) {
            let button = this.createDivWithClass('carousel__pagination__button');
            button.addEventListener('click', () => this.goToSlide(i + this.offset));
            pagination.appendChild(button);
            buttons.push(button);
        }

        this.onMove(index => {
            let count = this.items.length - 2 * this.offset;

            let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slideToScroll)];
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'));
                activeButton.classList.add('carousel__pagination__button--active');
            }
        })
    }

    disableTransition() {
        this.container.style.transition = 'none';
    }

    enableTransition() {
        this.container.style.transition = '';
    }

    translate(percentage) {
        this.container.style.transform = 'translate3d(' + percentage + '%, 0, 0)';
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
        if (slide < 0) {
            if (this.options.loop) {
                slide = this.items.length - this.slideVisible;
            } else {
                slide = 0;
            }
        } else if (
            slide >= this.items.length ||
            (this.items[this.currentSlide + this.slideVisible] === undefined && slide > this.currentSlide)
        ) {
            if (this.options.loop) {
                slide = 0;
            } else {
                slide = this.currentSlide;
            }
        }

        let translateX = slide * (-100 / this.items.length);
        if (animation === false) {
            this.disableTransition();
        }

        this.translate(translateX);

        this.container.offsetHeight; // force repaint
        if (animation === false) {
            this.enableTransition();
        }
        this.currentSlide = slide;
        this.moveCallbacks.forEach(cb => cb(slide));
    }

    /**
     * Deplace le container pour donner l'impression d'un slide infini
     */
    resetInfinite() {
        // prev
        if (this.currentSlide <= this.options.slideToScroll) {
            this.goToSlide(this.currentSlide + (this.items.length - 2 * this.offset), false);
        }

        // next
        else if (this.currentSlide >= this.items.length - this.offset) {
            this.goToSlide(this.currentSlide - (this.items.length - 2 * this.offset), false);
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

    /**
     * @returns {number}
     */
    get containerWidth() {
        return this.container.offsetWidth;
    }

    /**
     * @returns {number}
     */
    get carouselWidth() {
        return this.root.offsetWidth;
    }
}

let onReady = function () {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 1,
        slideVisible: 3,
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
        slideToScroll: 1,
        slideVisible: 3,
        infinite: true,
        pagination: false
    });
};

if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);