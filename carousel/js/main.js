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
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({},
            {
                slideToScroll: 1,
                slideVisible:1,
                loop: false
            }, options);
        this.container = this.createDivWithClass('carousel__container');
        this.currentItem = 0;
        this.scrollCallbacks = [];
        this.isMobile = false;
        // Get children HTML Element from this.element
        let children = [].slice.call(element.children);

        // Update DOM, this.element > root > container
        this.root = this.createDivWithClass('carousel');
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);

        // Update DOM, container > carousel__item > children. Return carousel__item[]
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        // Update style width (container & carousel__items)
        this.setStyle();
        // Update DOM with navigation ELEMENT
        this.setNavigation();

        this.scrollCallbacks.forEach(cb => cb(0));
    }

    /**
     * Applique les dimension aux elements
     */
    setStyle() {
        let ratio = this.items.length / this.options.slideVisible;
        // container width
        this.container.style.width = (ratio * 100) + '%';
        // carousel__items width
        this.items.forEach((item) => {
            item.style.width = (100 / this.items.length) + '%';
        });
    }

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
           if (index === 0) {
               prev.classList.add('carousel__prev--hidden');
           } else {
               prev.classList.remove('carousel__prev--hidden');
           }

           if(this.items[this.currentItem + this.options.slideVisible] === undefined) {
               next.classList.add('carousel__next--hidden');
           } else {
               next.classList.remove('carousel__next--hidden');
           }
        });
    }

    /**
     * @param {scrollCallback} cb
     */
    onScroll(cb) {
        this.scrollCallbacks.push(cb);
    }

    next() {
        this.goToItem(this.currentItem + this.options.slideToScroll);
    }

    prev() {
        this.goToItem(this.currentItem - this.options.slideToScroll);
    }

    /**
     * Deplace le carousel vers l'index desiré
     * @param {number} index
     */
    goToItem(index) {
        if (index < 0) {
            index = this.items.length - this.options.slideVisible;
        } else if (
            index >= this.items.length ||
            (this.items[this.currentItem + this.options.slideVisible] === undefined && index > this.currentItem)
        ) {
            index = 0;
        }
        let translateX = (-100 / this.items.length) * index;
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.scrollCallbacks.forEach(callback => callback(index));

        // Update currentItem
        this.currentItem = index;
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
    get SlideToScroll() {
        return this.isMobile ? 1 : this.options.slideToScroll;
    }

    /**
     * @returns {number}
     */
    get SlideVisible() {
        return this.isMobile ? 1 : this.options.slideVisible;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 1,
        slideVisible: 3,
    });

    new Carousel(document.querySelector('#carousel2'), {
        slideToScroll: 1,
        slideVisible: 3,
        loop: true
    });
});
