
import { IEvents } from "../base/events";
import { FormModel } from "./FormModel";

export interface IContactForm {
    email: string;
    phone: string;
}

export class ContactForm extends FormModel<IContactForm> {
    email: string;
    phone: string;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const form = fragment.querySelector('form') as HTMLFormElement;
        
        super(form, events);

        this._emailInput = form.querySelector('input[name="email"]');
        this._phoneInput = form.querySelector('input[name="phone"]');
    }

    clear():void{
        this._emailInput.value = ''
        this._phoneInput.value = ''
    };
}

