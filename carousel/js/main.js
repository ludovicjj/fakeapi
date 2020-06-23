class Carousel {

    /**
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} options.slideToScroll Nombre d'element à faire défiler
     * @param {Object} options.slideVisible Nombre d'element visible
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({}, {slideToScroll: 1, slideVisible:1}, options);
        this.container = this.createDivWithClass('carousel__container');
        this.currentItem = 0;
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
        let translateX = (-100 / this.items.length) * index;
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentItem = index;
    }

    /**
     *
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        return div
    }
}


document.addEventListener('DOMContentLoaded', function () {
    new Carousel(document.querySelector('#carousel1'), {
        slideToScroll: 1,
        slideVisible: 3
    });
});
