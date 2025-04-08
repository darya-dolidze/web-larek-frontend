import { IProduct } from "../../types";
import { Api, ApiListResponse } from "../base/api"

export class ApiModel extends Api {
    readonly cdnUrl: string;
    items: IProduct[];

    constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }

    async getListProducts(): Promise<IProduct[]> {
        const data = await super.get('/product') as ApiListResponse<IProduct>;

        if (data.items) {
            data.items = data.items.map(item => ({
                ...item,
                image: this.cdnUrl + item.image
            }));
        }
        return data.items;
    }

    async getProduct(product:IProduct): Promise<IProduct>{
        const item = await super.get(`/product/${product.id}`) as IProduct;
        if (item) {
        return {
            ...item,
            image: this.cdnUrl + item.image
        };
    }
    }
}
