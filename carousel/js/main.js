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

        this.children = [].slice.call(element.children);

        let ratio = this.children.length / this.options.slideVisible;
        let root = this.createDivWithClass('carousel');
        let container = this.createDivWithClass('carousel__container');
        container.style.width = (ratio * 100) + '%';
        root.appendChild(container);
        this.element.appendChild(root);

        this.children.forEach((child) => {
            let item = this.createDivWithClass('carousel__item');
            item.style.width = (100 / this.children.length) + "%";
            item.appendChild(child);
            container.appendChild(item);
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
