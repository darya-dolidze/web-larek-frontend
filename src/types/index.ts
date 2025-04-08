export interface IProduct{
    id: string;
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: "дополнительное" | "софт-скил" | "кнопка" | "хард-скил" | "другое";
}

export interface IForm {
    paymentMethod?: string;
    deliveryAddress?: string;
    email?: string;
    phone?: string;
    render(): HTMLElement;
    init() : void;
}

export interface IOrder {
    paymentMethod: string;
    deliveryAddress: string;
}

export interface IPersonalInfo {
    email: string;
    phone: string;
}