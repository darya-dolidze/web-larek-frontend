# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- **src/** — исходные файлы проекта
- **src/components/** — папка с JS компонентами
- **src/components/base/** — базовый код для компонентов

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/components/model — компоненты для моделей
- src/components/view — компоненты для отображения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание

Это веб-приложение для оформления заказов. Пользователи могут просматривать товары, добавлять их в корзину, заполнять контактные данные и оформлять заказ. Проект использует модульную структуру с TypeScript для организации кода и Webpack для сборки.

## Архитектура
![UML Диаграмма] (UML.jpg)

Проект разделен на несколько ключевых компонентов:

1. **ApiModel** — отвечает за взаимодействие с сервером для получения данных о продуктах и отправки заказов.
2. **ModelView** — управляет модальным окном, в которое загружается различный контент (форма заказа, корзина, персональные данные и успешное оформление).
3. **BasketView** — отображает корзину, добавление товаров, удаление и подсчет итоговой суммы.
4. **FormView** — базовый класс для отображения форм (например, для ввода контактных данных).
5. **OrderView** — отображает форму для оформления заказа, наследуется от `FormView`.
6. **PersonalInfoForm** — форма для ввода контактных данных, наследуется от `FormView`.
7. **ProductListView** — отображает список доступных продуктов.
8. **SuccessView** — отображает сообщение об успешном оформлении заказа.

---

## Основные классы

### ApiModel
Класс для взаимодействия с API. Получает данные о продуктах и отправляет заказы.
```typescript
class ApiModel {
    async getListProducts(): Promise<IProduct[]> { /* ... */ }
    async getProduct(product:IProduct): Promise<IProduct> { /* ... */ }
}
```
### ProductView
Отображает список товаров или отдельный товар и позволяет добавить товар в корзину.

```typescript
    class ProductListView {
        render(): HTMLElement { /* ... */ }
    }
```
### ModelView
Отвечает за управление модальными окнами, позволяет изменять их содержимое и открывать/закрывать.
```typescript
    class ModelView{
        setContent(content: HTMLElement): void { /* ... */ }
        open(): void { /* ... */ }
        close(): void { /* ... */ }
    }
```
### BasketView
Управляет отображением корзины, добавлением/удалением товаров, вычислением общей стоимости.

```typescript
    class BasketView {
        addToBasket(product: IProduct): void { /* ... */ }
        removeFromBasket(product: IProduct): void { /* ... */ }
        renderBasket(): void { /* ... */ }
    }
```
### FormView
Базовый класс для всех форм. Содержит логику валидации и обработки данных.

```typescript
    class FormView {
        render(): HTMLElement { /* ... */ }
        init(): void { /* ... */ }
    }
```
### OrderView
Форма заказа, наследуется от FormView. Содержит поля для ввода информации о доставке и способе оплаты.
```typescript
    class OrderView extends FormView {
        render(): HTMLElement { /* ... */ }
    }
```
### PersonalInfoForm
Форма для ввода email и номера телефона, также наследуется от FormView.

```typescript
    class PersonalInfoForm extends FormView {
        validate(): boolean { /* ... */ }
        render(): HTMLElement { /* ... */ }
    }
```
### SuccessView
Отображает окно с подтверждением успешного оформления заказа.

```typescript
    class SuccessView {
        render(): HTMLElement { /* ... */ }
    }
```

## Интерфейсы
Проект использует интерфейсы для описания структуры данных:
```typescript
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
```

## Брокеры событий

1. **Открывает модальное окно для отображения информации о выбранном продукте. Включает рендеринг продукта, обновление состояния корзины и управление кнопками в модальном окне.**
```typescript
    'card:select'
```

2. **Открывает модальное окно для отображения содержимого корзины.**
```typescript
    'basket:open'
```

3. **Открывает модальное окно для оформления заказа.**
```typescript
    'order:open'
```

4. **Открывает модальное окно для ввода персональных данных.**
```typescript
    'personalInfo:open'
```

5. **Открывает модальное окно для отображения сообщения об успешной оплате и оформления заказа.**
```typescript
    'success:open'
```

6. **Закрывает модальное окно.**
```typescript
    'model:close'
```

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```