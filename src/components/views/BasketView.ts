import { IActions, IProductBasket } from '../../types';
import { formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

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
		const basketContainer = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;

		super(basketContainer);

		this._title = basketContainer.querySelector('.modal__title');
		this._basketList = basketContainer.querySelector('.basket__list');
		this._basketPrice = basketContainer.querySelector('.basket__price');
		this._buttonOrder = basketContainer.querySelector('.basket__button');

		this._buttonOrder.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	// Сеттер для общей цены
	set price(value: number) {
		this.setText(this._basketPrice, formatPrice(value));
	}

	// Сеттер для списка товаров
	set list(items: HTMLElement[]) {
		this._basketList.replaceChildren(...items);
		if (items.length === 0) {
			const emptyElement = document.createElement('p');
			this.toggleClass(emptyElement, 'basket__empty', true);
			this.setText(emptyElement, 'Корзина пуста');
			this._basketList.append(emptyElement);
			this.setDisabled(this._buttonOrder, true);
		} else {
			this.setDisabled(this._buttonOrder, false);
		}
	}
}
export class BasketItemView extends Component<IProductBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		const itemElement = template.content
			.querySelector('.basket__item')
			?.cloneNode(true) as HTMLElement;

		super(itemElement);

		this._title = itemElement.querySelector('.card__title') as HTMLElement;
		this._price = itemElement.querySelector('.card__price') as HTMLElement;
		this._button = itemElement.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;
		this._index = itemElement.querySelector(
			'.basket__item-index'
		) as HTMLElement;
		this._button.addEventListener('click', (e) => {
			this.container.remove();
			actions?.onClick(e);
		});
	}

	set title(value: string) {
		this.setText(this._title, String(value));
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}

	set price(value: number | null) {
		this.setText(this._price, formatPrice(value));
	}
}
