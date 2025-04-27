import { IProduct } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModal {
  content: HTMLElement;
}

export class ModalView extends Component<IModal> {
    private _modalElement: HTMLElement;
    private _modalContent: HTMLElement;
    private _closeButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this._modalElement = document.querySelector('.modal') as HTMLElement;
        this._modalContent = this._modalElement?.querySelector('.modal__content') as HTMLElement;
        this._closeButton = this._modalElement?.querySelector('.modal__close') as HTMLElement;
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
        const scrollY = window.scrollY
        if (this._modalElement) {
            this._modalElement.style.position = 'absolute'; 
            this._modalElement.style.top = `${scrollY}px`;
        }
        
        this._modalElement.classList.add('modal_active');
        this.events.emit('modal:open'); 
    }

    close(): void {
        this._modalContent.innerHTML = '';
        this.events.emit('modal:close');
        this._modalElement.classList.remove('modal_active');
    }

    render(data?: Partial<IModal>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}