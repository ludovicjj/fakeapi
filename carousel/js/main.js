class Carousel {

    /**
     * This callback is displayed as part of the Carousel class.
     * @callback scrollCallback
     * @param {number} index
     */

    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {number} [options.slideToScroll=1] Nombre d'element à faire défiler
     * @param {number} [options.slideVisible=1] Nombre d'element visible
     * @param {boolean} [options.loop=false] Enable loop scroll
     * @param {boolean} [options.pagination=false]
     */
    constructor(element, options = {}) {
        // properties
        this.element = element;
        let children = [].slice.call(element.children);
        this.options = Object.assign({},
            {
                slideToScroll: 1,
                slideVisible:1,
                loop: false,
                pagination: false
            }, options);
        this.container = this.createDivWithClass('carousel__container');
        this.currentItem = 0;
        this.scrollCallbacks = [];
        this.isMobile = false;

        // Update DOM
        this.root = this.createDivWithClass('carousel');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.root.setAttribute('tabindex', '0');
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        this.setStyle();
        this.setNavigation();
        if (this.options.pagination) {
            this.createPagination();
        }

        // Event
        this.scrollCallbacks.forEach(cb => cb(0));
        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
        this.root.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next();
            }

            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev();
            }
        });
    }

    /**
     * Applique les dimension aux elements
     */
    setStyle() {
        let ratio = this.items.length / this.slideVisible;
        // container width
        this.container.style.width = (ratio * 100) + '%';
        // carousel__items width
        this.items.forEach((item) => {
            item.style.width = ((100 / this.slideVisible) / ratio) + '%';
            //item.style.width = (100 / this.items.length) + '%';
        });
    }

    /**
     * Create navigation arrow
     */
    setNavigation() {
        let next = this.createDivWithClass('carousel__next');
        let prev = this.createDivWithClass('carousel__prev');
        this.root.appendChild(next);
        this.root.appendChild(prev);
        next.addEventListener('click', this.next.bind(this));
        prev.addEventListener('click', this.prev.bind(this));

        if (this.options.loop === true) {
            return;
        }
        this.onScroll(index => {
            // previous
           if (index === 0) {
               prev.classList.add('carousel__prev--hidden');
           } else {
               prev.classList.remove('carousel__prev--hidden');
           }

           // next
           if (this.items[this.currentItem + this.slideVisible] === undefined) {
               next.classList.add('carousel__next--hidden');
           } else {
               next.classList.remove('carousel__next--hidden');
           }
        });
    }

    /**
     * Create pagination
     */
    createPagination() {
        let pagination = this.createDivWithClass('carousel__pagination');
        let buttons = [];
        this.root.appendChild(pagination);
        let limit = this.items.length - this.options.slideVisible + 1;
        for (let i = 0; i < limit; i = i + this.options.slideToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button');
            button.addEventListener('click', () => {this.goToItem(i)});
            pagination.appendChild(button);
            buttons.push(button);
        }
        this.onScroll(index => {

        })
    }

    /**
     * @param {scrollCallback} cb
     */
    onScroll(cb) {
        this.scrollCallbacks.push(cb);
    }

    onResize() {
        let mobile = window.innerWidth < 800;
        if (mobile !== this.isMobile) {
            this.isMobile = mobile;
            this.setStyle();
            this.scrollCallbacks.forEach(cb => cb(this.currentItem));
        }
    }

    next() {
        this.goToItem(this.currentItem + this.slideToScroll);
    }

    prev() {
        this.goToItem(this.currentItem - this.slideToScroll);
    }

    /**
     * Deplace le carousel vers l'index desiré
     * @param {number} index
     */
    goToItem(index) {
        if (index < 0) {
            if (this.options.loop) {
                index = this.items.length - this.slideVisible;
            } else {
                return;
            }
        } else if (
            index >= this.items.length ||
            (this.items[this.currentItem + this.slideVisible] === undefined && index > this.currentItem)
        ) {
            if (this.options.loop) {
                index = 0;
            } else {
                return;
            }
        }

        let translateX = (-100 / this.items.length) * index;
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';

        // Update currentItem
        this.currentItem = index;

        // onScroll(index)
        this.scrollCallbacks.forEach(callback => callback(index));
    }


    /**
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        return div
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
        slideToScroll: 1,
        slideVisible: 3,
        pagination: true
    });

    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 1,
        slideVisible: 1,
        loop: true,
        pagination: true
    });
};
if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);