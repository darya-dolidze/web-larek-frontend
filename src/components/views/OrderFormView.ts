import { IEvents } from '../base/events';
import { FormView } from './FormView';

export interface IOrderForm {
	payment: string;
	address: string;
}

export class OrderForm extends FormView<IOrderForm> {
	protected _address: HTMLInputElement;
	protected _payment = '';
	protected _buttons: NodeListOf<HTMLButtonElement>;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		const fragment = template.content.cloneNode(true) as DocumentFragment;
		const form = fragment.querySelector('form') as HTMLFormElement;

		super(form, events);

		this._address = form.querySelector('input[name="address"]');
		this._buttons = form.querySelectorAll('.order__buttons button');

		// навесим слушатели на кнопки способа оплаты
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setpayment(button.name);
			});
		});
	}

	setpayment(method: string) {
		this._payment = method;

		this._buttons.forEach((button) => {
			if (button.name === method) {
				this.toggleClass(button, 'button_alt-active', true);
			} else {
				this.toggleClass(button, 'button_alt-active', false);
			}
		});

		this.onInputChange('payment', method);
	}

	clear(): void {
		this._address.value = '';
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
}
