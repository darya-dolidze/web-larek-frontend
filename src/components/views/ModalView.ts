import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IModal {
	content: HTMLElement;
}

export class ModalView extends Component<IModal> {
	private _modalElement: HTMLElement;
	private _modalContent: HTMLElement;
	private _closeButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._modalElement = ensureElement<HTMLTemplateElement>('.modal');
		this._modalContent = this._modalElement?.querySelector(
			'.modal__content'
		) as HTMLElement;
		this._closeButton = this._modalElement?.querySelector(
			'.modal__close'
		) as HTMLElement;
		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}
	set content(content: HTMLElement) {
		this._modalContent.innerHTML = '';
		this._modalContent.appendChild(content);
	}

	open(): void {
		this.toggleClass(this._modalElement, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close(): void {
		this._modalContent.innerHTML = '';
		this.events.emit('modal:close');
		this.toggleClass(this._modalElement, 'modal_active', false);
	}

	render(data?: Partial<IModal>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
