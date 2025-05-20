import { FormErrors, FormType, IOrder, IProduct } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { IContactForm } from '../views/ContactFormView';
import { IOrderForm } from '../views/OrderFormView';

export class OrderModel extends Model<IOrder> {
	_valid = false;
	_errors: FormErrors = {};
	order: IOrder = {
		items: [], // Список товаров
		payment: '', // Способ оплаты
		address: '', // Адрес доставки
		phone: '', // Телефон пользователя
		email: '', // Электроная почта пользователя
		total: null,
	};

	setOrderField(field: keyof IOrderForm, value: string, form: FormType) {
		this.order[field] = value;
		let errors: FormErrors = {};
		if (form === 'orderform') {
			errors = this.validateOrderForm(this.order);
		} else if (form === 'contactform') {
			errors = this.validateContactForm(this.order);
		} else {
			errors = {};
		}

		const isValid = Object.keys(errors).length === 0;

		this._valid = isValid;
		this._errors = errors;
	}

	validateOrderForm(data: IOrderForm): FormErrors {
		const errors: FormErrors = {};

		if (!data.address || data.address.trim().length < 5) {
			errors.address = 'Введите корректный адрес';
		}

		if (!data.payment || !['card', 'cash'].includes(data.payment)) {
			errors.payment = 'Выберите способ оплаты';
		}
		return errors;
	}

	validateContactForm(data: IContactForm): FormErrors {
		const errors: FormErrors = {};
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!data.email || !emailPattern.test(data.email)) {
			errors.email = 'Введите правильный Email';
		}

		const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
		data.phone = data.phone.replace(/\D/g, '');

		if (data.phone.startsWith('7')) {
			data.phone =
				'+7(' +
				data.phone.slice(1, 4) +
				')' +
				data.phone.slice(4, 7) +
				'-' +
				data.phone.slice(7, 9) +
				'-' +
				data.phone.slice(9, 11);
		}

		if (!data.phone || !phonePattern.test(data.phone)) {
			errors.phone = 'Введите правильный номер телефона';
		}

		return errors;
	}

	refresh() {
		this.order = {
			items: [],
			total: null,
			address: '',
			email: '',
			phone: '',
			payment: '',
		};
	}

	get errors(): FormErrors {
		return this._errors;
	}
	get valid(): boolean {
		return this._valid;
	}
}

export class BasketModel extends Model<IProduct[]> {
	items: IProduct[];

	constructor(data: IProduct[] = [], events: IEvents) {
		super(data, events);
		this.items = data ?? [];
	}
	add(product: IProduct) {
		this.items.push(product);
		this.emitChanges('basket:changed');
	}
	remove(productId: string) {
		const removedProduct = this.items.find(p => p.id === productId);
        this.items = this.items.filter((p) => p.id !== productId);
        this.emitChanges('basket:changed', {
            action: 'remove',
            product: removedProduct
        });
	}

	getCount() : number {
        return this.items.length;
	}

	getTotalPrice() : number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	clean() {
		this.emitChanges('basket:changed', {
            action: 'clean'
        });
	}
	
	getState() {
        return {
            items: this.items,
            count: this.getCount(),
            total: this.getTotalPrice()
        };
    }
}
