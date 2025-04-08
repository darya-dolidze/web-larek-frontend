import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketView {
    protected _basketTemplate: HTMLTemplateElement;
    protected _basketContainer: HTMLElement;
    protected _title: HTMLElement;
    protected _basketList: HTMLElement;
    protected _buttonOrder: HTMLButtonElement;
    protected _basketPrice: HTMLElement;
    protected _headerBasketButton: HTMLButtonElement;
    protected _headerBasketCounter: HTMLElement;
    protected items: IProduct[] = [];

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this._basketTemplate = template;
        this._basketContainer = this._basketTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement;

        this._title = this._basketContainer.querySelector('.modal__title');
        this._basketList = this._basketContainer.querySelector('.basket__list');
        this._buttonOrder = this._basketContainer.querySelector('.basket__button');
        this._basketPrice = this._basketContainer.querySelector('.basket__price');
        this._headerBasketButton = document.querySelector('.header__basket');
        this._headerBasketCounter = document.querySelector('.header__basket-counter');

        this._buttonOrder.addEventListener('click', () => { this.events.emit('order:open') });
        this._headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') });

        this.events.on('basket:add', (product: IProduct) => this.addToBasket(product));
    }

    addToBasket(product: IProduct) {
        this.items.push(product);
        this.renderBasket();
    }

    renderBasket() {
        this._basketList.innerHTML = "";
        if (this.items.length === 0) {
            this._basketList.innerHTML = "<p class='basket__empty'>Корзина пуста</p>";
            this._basketPrice.textContent = "0 синапсов";
            this._buttonOrder.disabled = true;
            return;
        }
        this.items.forEach((product, index) => {
            const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
            const itemElement = itemTemplate.content.cloneNode(true) as HTMLElement;

            const titleElement = itemElement.querySelector('.card__title') as HTMLElement;
            const priceElement = itemElement.querySelector('.card__price') as HTMLElement;
            const deleteButton = itemElement.querySelector('.basket__item-delete') as HTMLButtonElement;
            const indexElement = itemElement.querySelector('.basket__item-index') as HTMLElement;

            this._buttonOrder.disabled = false;

            titleElement.textContent = product.title;
            if (product.price === null){
                priceElement.textContent = `Бесценно`;
            } else{
                priceElement.textContent = `${product.price} синапсов`;
            }

            indexElement.textContent = String(index + 1);
            deleteButton.addEventListener('click', () => {
                this.removeFromBasket(product);
            });
            this._basketList.appendChild(itemElement);
        });
        this._basketPrice.textContent = this.getSumAllProducts();
        this.renderHeaderBasketCounter(this.items.length);
    }

    renderHeaderBasketCounter(value: number): void {
        this._headerBasketCounter.textContent = String(value);
    }

    getSumAllProducts(): string {
        const sumAll = this.items.reduce((sum, product) => sum + product.price, 0)
        return `${sumAll} синапсов`;
    }

    render(): HTMLElement {
        this._title.textContent = 'Корзина';
        this.renderBasket();
        return this._basketContainer;
    }
    
    removeFromBasket(product: IProduct) {
        this.items = this.items.filter(item => item !== product);
        this.renderBasket();
    }

    clearBasket() {
        this.items = []
        this.renderBasket()
    }

    listElementBasket(): Array<IProduct> {
        return this.items;
    }
}
