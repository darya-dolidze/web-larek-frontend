import { IActions, IProduct, IProductBasket } from "../../types";
import { formatPrice } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IBasket {
  list: HTMLElement[];
  price: number;
}

export class BasketView extends Component<IBasket> {
    protected _title: HTMLElement;
    protected _basketList: HTMLElement;
    protected _buttonOrder: HTMLButtonElement;
    protected _basketPrice: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        const basketContainer = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;

        super(basketContainer)
        
        this._title = basketContainer.querySelector('.modal__title');
        this._basketList = basketContainer.querySelector('.basket__list');
        this._basketPrice = basketContainer.querySelector('.basket__price');
        this._buttonOrder = basketContainer.querySelector('.basket__button');

        this._buttonOrder.addEventListener('click', () => { this.events.emit('order:open') });
    }  
    
    // Сеттер для общей цены
    set price(value: number) {
        this._basketPrice.textContent = formatPrice(value);
    }

    // Сеттер для списка товаров 
    set list(items: HTMLElement[]) {
        this._basketList.replaceChildren(...items);
        if (items.length === 0) {
            const emptyElement = document.createElement('p');
            emptyElement.classList.add('basket__empty');
            emptyElement.textContent = 'Корзина пуста';
            this._basketList.append(emptyElement);
            this._buttonOrder.disabled = true;
        } else {
            this._buttonOrder.disabled = false;
        }
    }
    
}
export class BasketItemView extends Component<IProductBasket> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?:IActions) {
        const itemElement = template.content.querySelector('.basket__item')!.cloneNode(true) as HTMLElement;

        super(itemElement);

        this._title = itemElement.querySelector('.card__title') as HTMLElement;
        this._price = itemElement.querySelector('.card__price') as HTMLElement;
        this._button = itemElement.querySelector('.basket__item-delete') as HTMLButtonElement;
        this._index = itemElement.querySelector('.basket__item-index') as HTMLElement;
        this._button.addEventListener('click', (e) => {
            this.container.remove();
            actions?.onClick(e);
        });
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set index(value: number) {
        this._index.textContent = value.toString();
    }

    set price(value: number | null) {
        this._price.textContent = formatPrice(value);
    }
}
