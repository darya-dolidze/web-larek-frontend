import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { FormView } from './FormView';

export interface IContactForm {
	email: string;
	phone: string;
}

export class ContactForm extends FormView<IContactForm> {
	email: string;
	phone: string;
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(form: HTMLFormElement, protected events: IEvents) {
		super(form, events);

		this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
	}

	clear(): void {
		this._emailInput.value = '';
		this._phoneInput.value = '';
	}
}
