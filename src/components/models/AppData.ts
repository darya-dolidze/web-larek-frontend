import { IAppState, IProduct } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { BasketModel, OrderModel } from './Models';

export class AppState extends Model<IAppState> {
	basket: BasketModel;
	catalog: IProduct[];
	order: OrderModel;

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
		this.basket = new BasketModel([], events);
		this.order = new OrderModel({}, events);
		this.catalog = [];
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => ({
			...item,
			selected: false,
		}));
		this.emitChanges('items:show', { catalog: this.catalog });
	}

	resetSelected() {
		this.catalog.forEach((item) => (item.selected = false));
	}

	setItemsOrder() {
		this.order.order.items = this.basket.items.map((item) => item.id);
	}

	setTotalPriceOrder() {
		this.order.order.total = this.basket.totalPrice;
	}
}
