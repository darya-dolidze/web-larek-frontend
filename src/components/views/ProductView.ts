import { IProduct } from "../../types";

export class ProductListView{
    protected _productTemplate: HTMLTemplateElement;
    protected _productContainer!: HTMLElement
    private categoryClassMap: Record<IProduct["category"], string> = {
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other"
    };

    constructor(template: HTMLTemplateElement) {
        this._productTemplate = template
    }
    
    protected setPrice(price: number | null): string{
        return price === null ? "Бесценно" : `${price} синапсов`;
    }
    
    renderProduct(data: IProduct): HTMLElement{
        this._productContainer = this._productTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
        const productCategory = this._productContainer.querySelector('.card__category') as HTMLImageElement| null;
        const productTitle = this._productContainer.querySelector('.card__title') as HTMLImageElement;
        const productImage = this._productContainer.querySelector('.card__image') as HTMLImageElement;
        const productPrice = this._productContainer.querySelector('.card__price') as HTMLImageElement;

        productTitle.textContent=data.title;
        productImage.src=data.image;
        productImage.alt=data.title;
        productPrice.textContent=this.setPrice(data.price);

        if(productCategory){
            const categoryKey = this.categoryClassMap[data.category] ? data.category : "другое";
            const categoryClass = this.categoryClassMap[categoryKey];

            productCategory.textContent = categoryKey;
            productCategory.classList.add(`card__category_${categoryClass}`);
        }
        return this._productContainer
    }
}