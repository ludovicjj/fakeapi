class Actor {
    /**
     * @param {HTMLElement}     element
     * @param {Object}          options
     */
    constructor(element, options) {
        // properties
        this.container = element;
        this.options = Object.assign(
            {},
            {rowVisible: 3},
            options,
        );
        let children = this.getChildren();
        let limit = this.hasChildrenOverLimit(children);

        //DOM
        if (limit) {
            // Items to hide
            let items = this.getChildrenToHide(children);
            let itemsHeight = this.getItemsHeight(items);
            let subContainer = this.createDivWithClass('sub_container');
            this.moveInto(items, subContainer);
            this.container.appendChild(subContainer);

            // Button
            let btn = this.createDivWithClass('action-js');
            this.updateContent(btn, 'Voir la liste conplète');
            this.container.appendChild(btn);

            // EVENT
            btn.addEventListener('click', () => {
                if (subContainer.offsetHeight < itemsHeight) {
                    subContainer.style.height = itemsHeight + 'px';
                    this.updateContent(btn, 'Voir moins');
                } else {
                    subContainer.style.height = '0px';
                    this.updateContent(btn, 'Voir la liste conplète');
                }
            })
        }
    }

    /**
     * @returns {HTMLDivElement[]}
     */
    getChildren() {
        return [].slice.call(this.container.children);
    }

    /**
     * @param {HTMLDivElement[]} children
     * @returns {boolean}
     */
    hasChildrenOverLimit(children) {
        return children.length > this.options.rowVisible;
    }

    /**
     * @param {string} className
     * @returns {HTMLDivElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div');
        div.classList.add(className);
        return div;
    }

    /**
     * @param {HTMLDivElement[]} children
     * @returns {HTMLDivElement[]}
     */
    getChildrenToHide(children) {
        let items = children.map((child, index) => {
            if(index > (this.options.rowVisible - 1)) {
                return child;
            }
        });
        return items.filter(element => {
            return element != null;
        });
    }

    /**
     * @param {HTMLDivElement[]} items
     * @param {HTMLDivElement} container
     */
    moveInto(items, container) {
        items.forEach((item) => {
            container.appendChild(item);
        });
    }

    /**
     * @param {HTMLDivElement[]} items
     */
    getItemsHeight(items) {
        return items.reduce(function(acc, currentValue, index) {
            return acc + currentValue.offsetHeight;
        }, 0);
    }

    /**
     * @param {HTMLDivElement} element
     * @param {string} content
     */
    updateContent(element, content) {
        element.innerHTML = content;
    }

}

let onReady = function () {
    new Actor(document.querySelector('.actor_container'), {
        rowVisible: 2
    });
};
if (document.readyState !== 'loading') {
    onReady();
}
document.addEventListener('DOMContentLoaded', onReady);