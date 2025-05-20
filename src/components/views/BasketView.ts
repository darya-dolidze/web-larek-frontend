import { IActions, IProductBasket } from '../../types';
import { formatPrice, ensureElement } from '../../utils/utils';
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
		const basketContainer = template

		super(basketContainer);

		this._title = ensureElement<HTMLElement>('.modal__title', basketContainer);
		this._basketList = ensureElement<HTMLElement>('.basket__list', basketContainer);
		this._basketPrice = ensureElement<HTMLElement>('.basket__price', basketContainer);
		this._buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', basketContainer);

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
		itemElement: HTMLElement,
		protected events: IEvents,
		actions?: IActions
	) {
		super(itemElement);

		this._title = ensureElement<HTMLElement>('.card__title', itemElement)
		this._price = ensureElement<HTMLElement>('.card__price', itemElement)
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete', itemElement
		) as HTMLButtonElement;
		this._index = ensureElement<HTMLElement>(
			'.basket__item-index', itemElement
		)
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
