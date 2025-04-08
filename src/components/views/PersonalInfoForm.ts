import { IPersonalInfo } from "../../types";
import { IEvents } from "../base/events";
import { FormModel } from "../models/FormModel";

export class PersonalInfoForm extends FormModel implements IPersonalInfo{
    email: string;
    phone: string;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;


    constructor(formTemplate: HTMLTemplateElement, protected events: IEvents) {
        super(formTemplate, events);
        this._emailInput = this._formOrderContainer.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = this._formOrderContainer.querySelector('input[name="phone"]') as HTMLInputElement;
        this._nextButton.addEventListener('click', () => { 
            if (this.validate()){
                this.events.emit('success:open') 
            }else{
                this.events.emit('personalInfo:open')
            }
        });

        this.init();
    }

    // Инициализация событий
    init() {
        // Слушаем изменение email
        this._emailInput.addEventListener('input', () => {
            this.email = this._emailInput.value;
            this.updateNextButtonState();
        });

        // Слушаем изменение телефона
        this._phoneInput.addEventListener('input', () => {
            this.phone = this._phoneInput.value;
            this.updateNextButtonState();
        });
    }

    private validate(): boolean {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.email || !emailPattern.test(this.email)) {
            alert('Введите правильный Email');
            return false;
        }
        const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        
        this.phone = this.phone.replace(/\D/g, '');

        if (this.phone.startsWith('7')) {
            this.phone = '+7(' + this.phone.slice(1, 4) + ')' + this.phone.slice(4, 7) + '-' + this.phone.slice(7, 9) + '-' + this.phone.slice(9, 11);
        }

        if (!this.phone || !phonePattern.test(this.phone)) {
            alert('Введите правильный номер телефона');
            return false;
        }
        return true;
    }
}

