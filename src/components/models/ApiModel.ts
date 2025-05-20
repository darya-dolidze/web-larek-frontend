import { IOrder, IOrderResult, IProduct } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class WebLarekApi extends Api {
	readonly cdnUrl: string;

	constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdnUrl = cdnUrl;
	}

	async getListProducts(): Promise<IProduct[]> {
		const data = (await super.get('/product')) as ApiListResponse<IProduct>;

		if (data.items) {
			data.items = data.items.map((item) => ({
				...item,
				image: this.cdnUrl + item.image,
			}));
		}
		return data.items;
	}
	//Метод для отправки заказа
    async sendOrder(orderData: IOrder): Promise<IOrderResult> {
        return await super.post('/order', orderData) as IOrderResult;
    }

}
