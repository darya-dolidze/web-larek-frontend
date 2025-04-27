export type CategoryType = |"дополнительное" | "софт-скил" | "кнопка" | "хард-скил" | "другое";

export type CategoryMap = {
    [Key in CategoryType]: string;
}

export type formErrors = Partial<Record<keyof IOrder, string>>

export type FormType = 'orderform' | 'contactform';

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IProduct{
    id: string; // Уникальный идентификатор
    title: string; // Наименование товара
    description: string; // Описание товара
    price: number | null; // Цена товара
    image: string; // Ссылка на изображение товара
    category: CategoryType; // Категория товара
    selected: boolean;
}

export interface IProductBasket extends IProduct {
  id: string; // Уникальный идентификатор
  index: number; // Порядковый номер в корзине
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface IOrder {
    items: string[]; // Список товаров
    payment: string; // Способ оплаты
    address: string; // Адрес доставки
    phone: string; // Телефон пользователя
    email: string; // Электроная почта пользователя
    total: number | null; // Итоговая сумма заказа
    // validateOrder(): boolean; // Вылидация заказа
}

export interface IAppState{
    setStore(items: IProduct[]): void;
}