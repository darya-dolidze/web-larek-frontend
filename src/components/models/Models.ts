import { CategoryType, FormType, IOrder, IProduct, formErrors } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";
import { IBasket } from "../views/BasketView";
import { IContactForm } from "../views/ContactFormView";
import { IOrderForm } from "../views/OrderFormView";

export class ProductModel extends Model<IProduct>{
    id: string;
    description: string;
    image: string;
    title: string;
    category: CategoryType;
    price: number | null;
    selected: boolean;
}

export class OrderModel extends Model<IOrder>{
    _valid: boolean = false;
    _errors: formErrors = {};
    order: IOrder = {
        items: [], // Список товаров
        payment: '', // Способ оплаты
        address: '', // Адрес доставки
        phone: '', // Телефон пользователя
        email: '', // Электроная почта пользователя
        total: null
    }

    setOrderField(field: keyof IOrderForm, value: string, form: FormType) {
        this.order[field] = value;
        let errors: formErrors = {};
        if (form === 'orderform'){
            errors = this.validateOrderForm(this.order);
        } else if (form === 'contactform'){
            errors = this.validateContactForm(this.order);
        } else {
            errors = {}
        }

        const isValid = Object.keys(errors).length === 0;

        this._valid = isValid;
        this._errors = errors;
    }

    validateOrderForm(data: IOrderForm): formErrors {
        const errors: formErrors = {};

        if (!data.address || data.address.trim().length < 5) {
            errors.address = 'Введите корректный адрес';
        }

        if (!data.payment || !['card', 'cash'].includes(data.payment)) {
            errors.payment = 'Выберите способ оплаты';
        }
        return errors
    }

    validateContactForm(data: IContactForm): formErrors {
        const errors: formErrors = {};
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!data.email || !emailPattern.test(data.email)) {
            errors.email = 'Введите правильный Email'
        }

        const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        data.phone = data.phone.replace(/\D/g, '');

        if (data.phone.startsWith('7')) {
            data.phone = '+7(' + data.phone.slice(1, 4) + ')' + data.phone.slice(4, 7) + '-' + data.phone.slice(7, 9) + '-' + data.phone.slice(9, 11);
        }

        if (!data.phone || !phonePattern.test(data.phone)) {
            errors.phone = 'Введите правильный номер телефона';
        }

        return errors
    }

    refresh() {
        this.order = {
        items: [],
        total: null,
        address: '',
        email: '',
        phone: '',
        payment: ''
        };
    }

    get errors(): formErrors {
        return this._errors;
    }
    get valid(): boolean {
        return this._valid;
    }
}


export class BasketModel extends Model<ProductModel[]>{
    items: ProductModel[];
    countProduct: number;
    totalPrice: number;

    constructor(data: ProductModel[] = [], events: IEvents) {
        super(data, events);
        this.items = data ?? [];
        this.update();
    }
    add(product: ProductModel) {
        this.items.push(product);
        this.update();
    }
    remove(productId: string) {
        this.items = this.items.filter(p => p.id !== productId);
    }

    getCount(){
        return this.countProduct
    }

    getTotalPrice(){
        return this.totalPrice
    }

    update() {
        this.countProduct = this.items.length;
        this.totalPrice = this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }
    clean(){
        this.items.length = 0;
    }
}