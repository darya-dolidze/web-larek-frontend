import { CategoryType, IActions, IProduct } from '../../types';
import { categoryClassMap } from '../../utils/constants';
import { ensureElement, formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';

export class ProductListView extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
				
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector(
			'.card__button'
		) ;

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, String(value));
	}
	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		this.setText(this._price, formatPrice(value));
	}

	set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(this._category, 'card__category_other', false);
		this.toggleClass(
			this._category,
			`card__category_${categoryClassMap[value]}`,
			true
		);
	}

	set selected(value: boolean) {
		if (this._price.textContent == 'Бесценно') {
			this.setDisabled(this._button, true);
		} else if (!this._button.disabled) {
			this.setDisabled(this._button, value);
		}
	}
}
