import AbstractComponent from './abstract-component.js';
import errors from '../errors.js';

export default class extends AbstractComponent {
    constructor() {
        super();
        this.htmlPath = '/static/html/categoryselector.html';
        this.selectedCategoryId = null;
        this.currentType = 0;
    }

    async install(parent) {
        document.getElementById(parent).innerHTML = await this.getHtml(this.htmlPath);

        this.setup();
        this.updateCategory(this.currentType);
    }

    setup() {
        this.selectedCategoryElement = document.querySelector('.category-selector .selected-category');
        this.selectorElement = document.querySelector('.category-selector .selector-container');
        this.categoriesElement = document.querySelector('.category-selector .selector-container .categories');
        this.typesElement = document.querySelector('.category-selector .selector-container .types');

        this.selectedCategoryElement.addEventListener('click', () => this.toggleCategoriesActive());
        this.categoriesElement.addEventListener('click', e => this.selectCategory(e));
        this.typesElement.addEventListener('click', e => this.selectType(e));

        this.selectedCategoryElement.innerHTML = '账目类型';
    }

    async updateCategory(type) {
        // 从后端获取类型并填充到账目类型中
        const resp = await fetch(`/api/category/type/${type}`);
        if (!resp.ok) {
            throw new errors.RequestError(resp.status);
        }
        const data = await resp.json();
        if (data.code !== 0) {
            throw new errors.ApiError(data.code, data.msg);
        }

        this.categoriesElement.innerHTML = '';
        for (let c of data.data) {
            const elem = document.createElement('div');
            elem.classList.add('category');
            elem.setAttribute('category_id', c.id);
            elem.innerText = c.name;
            this.categoriesElement.appendChild(elem);
        }

        const addElem = document.createElement('div');
        addElem.classList.add('category');
        addElem.classList.add('add-category-button');
        addElem.innerHTML = '+';
        this.categoriesElement.appendChild(addElem);
    }

    selectType(e) {
        this.currentType = e.target.getAttribute('type_id');
        if (this.currentType === null) {
            this.currentType = 0;
        }
        this.updateCategory(this.currentType);
    }

    selectCategory(e) {
        if (e.target.classList.contains('add-category-button')) {
            e.target.innerHTML = ''
            const elem = document.createElement('input');
            elem.classList.add('new-category-input');
            elem.type = 'text';
            e.target.appendChild(elem);
            elem.addEventListener('change', e => this.addNewCategory(e));

            return;
        }
        if (e.target.classList.contains('category')) {
            this.selectedCategoryId = e.target.getAttribute('category_id');
            this.selectedCategoryElement.innerText = e.target.innerText;
            this.toggleCategoriesActive();
            return;
        }
    }

    addNewCategory(e) {
        const name = e.target.value;
        fetch('/api/category', {
            method: 'POST',
            body: JSON.stringify({type: this.currentType, name: name}),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new errors.RequestError(resp.status);
            }
            return resp.json();
        })
        .then(data => {
            if (data.code !== 0) {
                throw new errors.ApiError(data.code, data.msg);
            }
        })
        .then(() => {
            this.updateCategory(this.currentType);
        });
    }

    toggleCategoriesActive() {
        this.selectorElement.classList.toggle('active');
        if (this.selectorElement.classList.contains('active')) {
            this.updateCategory(this.currentType);
        }
    }

    get category() {
        return {type: this.currentType, category: this.selectedCategoryId};
    }
}