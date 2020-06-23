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

        // Get children HTML Element from this.element
        let children = [].slice.call(element.children);

        // Update DOM, this.element > root > container
        let root = this.createDivWithClass('carousel');
        root.appendChild(this.container);
        this.element.appendChild(root);

        // Update DOM, container > carousel__item > children. Return carousel__item[]
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });
        // Update style width (container & carousel__items)
        this.setStyle();
    }

    setStyle() {
        let ratio = this.items.length / this.options.slideVisible;
        // container width
        this.container.style.width = (ratio * 100) + '%';
        // carousel__items width
        this.items.forEach((item) => {
            item.style.width = (100 / this.items.length) + '%';
        });
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
        slideToScroll: 3,
        slideVisible: 3
    });
});
