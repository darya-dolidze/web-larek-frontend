import { IForm } from "../../types";
import { IEvents } from "../base/events";

export class FormModel implements IForm {
    paymentMethod?: string;
    deliveryAddress?: string;
    email?: string;
    phone?: string;

    protected _formOrderContainer: HTMLElement;
    protected _nextButton: HTMLButtonElement;

    constructor(formTemplate: HTMLTemplateElement, protected events: IEvents) {
        this._formOrderContainer = formTemplate.content.cloneNode(true) as HTMLElement;
        this._nextButton = this._formOrderContainer.querySelector('.modal__actions button') as HTMLButtonElement;
    }

    // Обновление состояния кнопки 
    protected updateNextButtonState(): void {
        if ((this.paymentMethod && this.deliveryAddress)||(this.email && this.phone)) {
            this._nextButton.disabled = false;
        } else {
            this._nextButton.disabled = true;
        }
    }

    render(): HTMLElement {
        return this._formOrderContainer;
    }

    init(): void {
        throw new Error("Метод init должен быть переопределен в дочернем классе");
    }
}