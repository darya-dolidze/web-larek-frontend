import { IForm, FormErrors } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class FormView<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement; // кнопка отправки формы
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]', container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);

		// Слушаем все изменения полей ввода
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as
				| HTMLInputElement
				| HTMLSelectElement
				| HTMLTextAreaElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		// Слушаем отправку формы
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.constructor.name.toLowerCase()}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.constructor.name.toLowerCase()}:change`, {
			field,
			value,
		});
	}

	set errors(errors: FormErrors) {
		const messages = Object.values(errors).filter(Boolean);
		this.setText(this._errors, messages.join('; '));
	}
	set valid(isValid: boolean) {
		this.setDisabled(this._submit, !isValid);
	}
}
