import { IOrder } from "../../types";
import { IEvents } from "../base/events";
import { FormModel } from "../models/FormModel";


export class OrderForm extends FormModel implements IOrder {
    paymentMethod: string;
    deliveryAddress: string;

    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _address: HTMLInputElement;


    constructor(formTemplate: HTMLTemplateElement, protected events: IEvents) {
        super(formTemplate, events);
        this._paymentButtons = this._formOrderContainer.querySelectorAll('.order__buttons button');
        this._address = this._formOrderContainer.querySelector('.form__input') as HTMLInputElement;
        this._nextButton.addEventListener('click', () => { this.events.emit('personalInfo:open') });

        this.init();
    }

    // Инициализация событий
    init() {
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.paymentMethod = button.textContent || '';
                this.paymentSelection = button.name;
                this.updateNextButtonState();
            });
        });

        this._address.addEventListener('input', () => {
            this.deliveryAddress = this._address.value;
            this.updateNextButtonState();
        });
    }

    set paymentSelection(paymentMethod: string) {
    this._paymentButtons.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }

}