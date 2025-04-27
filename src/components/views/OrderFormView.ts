import { FormType, IOrder } from "../../types";
import { IEvents } from "../base/events";
import { FormModel } from "./FormModel";

export interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderForm extends FormModel<IOrderForm> {
    protected _address: HTMLInputElement;
    protected _payment: string = '';
    protected _buttons: NodeListOf<HTMLButtonElement>;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const form = fragment.querySelector('form') as HTMLFormElement;
        
        super(form, events);

        this._address = form.querySelector('input[name="address"]')!;
        this._buttons = form.querySelectorAll('.order__buttons button');

        // навесим слушатели на кнопки способа оплаты
        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.setpayment(button.name);
            });
        });
    }

    setpayment(method: string) {
        this._payment = method;

        this._buttons.forEach(button => {
        if (button.name === method) {
            button.classList.add('button_alt-active');
        } else {
            button.classList.remove('button_alt-active');
        }
        });

        this.onInputChange('payment', method);
    }
    
    clear(): void {
        this._address.value = '';
        this._buttons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
    }
}