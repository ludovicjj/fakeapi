class Test {

    /**
     * This callback is displayed as part of the Carousel class.
     * @callback callbacks
     * @param {number} index
     */

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.root = element;
        this.storage = [];
        let children = [].slice.call(this.root.children);
        this.items = children.map((child) => {
            return child;
        });
        this.pagination = this.makeDivWithClass('t-pagination');
        this.root.appendChild(this.pagination);

        this.makePagination();
        this.storage.forEach(cb => cb(0));
    }

    goToItem(index) {
        this.items.forEach((item) => {
            item.classList.remove('active');
        });
        this.items[index].classList.add('active');
    }

    makePagination() {
        let buttons = [];
        for (let i =0; i < this.items.length; i++) {
            let paginationItem = this.makeDivWithClass('t-pagination-item');
            paginationItem.addEventListener('click', () => this.goToItem(i));
            this.pagination.appendChild(paginationItem);
            buttons.push(paginationItem);
        }
    }

    makeDivWithClass(className) {
        let div = document.createElement('div');
        div.className = className;
        return div;
    }

    /**
     *
     * @param {callbacks}cb
     */
    onStorage(cb) {
        this.storage.push(cb);
    }

}

new Test(document.querySelector('.test'));
