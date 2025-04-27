import { CategoryType, IActions, IProduct } from "../../types";
import { categoryClassMap } from "../../utils/constants";
import { formatPrice } from "../../utils/utils";
import { Component } from "../base/Component";



export class ProductListView extends Component<IProduct>{
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, actions?:IActions) {
        const container = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string){
        this._title.textContent = value;
    }
    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this._image.src = value;
    }

    set price(value: number | null){
        this._price.textContent = formatPrice(value);
    }

    set category(value: CategoryType){
        const categoryKey = categoryClassMap[value] ? value : "другое";
        const categoryClass = categoryClassMap[categoryKey];
        this._category.textContent = categoryKey;
        this._category.classList.add(`card__category_${categoryClass}`)
    }

    set selected(value: boolean) {
        if (!this._button.disabled) {
            this._button.disabled = value;
        }
  }
}
