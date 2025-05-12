import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
	catalog: HTMLElement[];
	counter: number;
}

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _basketCounter: HTMLElement;

	constructor(template: HTMLElement, protected events: IEvents) {
		super(template);
		this._catalog = ensureElement<HTMLTemplateElement>('.gallery');
		this._wrapper = ensureElement<HTMLTemplateElement>('.page__wrapper');
		this._basket = ensureElement<HTMLTemplateElement>('.header__basket');
		this._basketCounter = ensureElement<HTMLTemplateElement>(
			'.header__basket-counter'
		);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set cartItemsCount(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set scrollLock(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}

	set counter(value: number) {
		this.setText(this._basketCounter, String(value));
	}
}
