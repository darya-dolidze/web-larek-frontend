import { IAppState, IProduct } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";
import { BasketModel, OrderModel, ProductModel } from "./Models";

export class AppState extends Model<IAppState>{
    basket: BasketModel;
    catalog: ProductModel[];
    order: OrderModel;

    constructor({}, events:IEvents){
        super({}, events);
        this.basket = new BasketModel([], events);
        this.order = new OrderModel({}, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map((item) => new ProductModel({ ...item, selected: false }, this.events));
        this.emitChanges('items:show', { catalog: this.catalog });
    }

    resetSelected() {
        this.catalog.forEach(item => item.selected = false)
    }

    setItemsOrder(){
        this.order.order.items = this.basket.items.map(item => item.id)
        
    }

    setTotalPriceOrder(){
        this.order.order.total = this.basket.totalPrice
    }

}