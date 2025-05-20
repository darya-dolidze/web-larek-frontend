import { IActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface ISuccess {
	description: number;
}

export class SuccessView extends Component<ISuccess> {
	private _closeButton: HTMLButtonElement;
	private _successDescription: HTMLElement;

	constructor(
		container: HTMLElement,
		private events: IEvents,
		actions?: IActions
	) {
		super(container);

		this._successDescription = ensureElement<HTMLButtonElement>(
			'.order-success__description', container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close', container
		);

		if (actions?.onClick) {
			if (this._closeButton) {
				this._closeButton.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
		this.setText(this._successDescription, `Списано ${value ?? '0 синапсов'}`);
	}
}
