import { IEvents } from "../base/events";


export class SuccessView {
    
    private _successContainer: HTMLElement;
    private _closeButton: HTMLButtonElement;
    private _successDescription: HTMLElement;

    constructor(template: HTMLTemplateElement, private events: IEvents, sumProducts?: string) {

        this._successContainer = template.content.cloneNode(true) as HTMLElement;
        this._successDescription = this._successContainer.querySelector('.order-success__description') as HTMLButtonElement;
        this._closeButton = this._successContainer.querySelector('.order-success__close') as HTMLButtonElement;
        this._successDescription.textContent = `Списано ${sumProducts ?? '0 синапсов'}`;
        this._closeButton.addEventListener('click', () => {
            this.events.emit('model:close');
        });
    }

    render(): HTMLElement {
        return this._successContainer;
    }
}