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
- src/components/models — компоненты для моделей
- src/components/views — компоненты для отображения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание

---

Это веб-приложение для оформления заказов. Пользователи могут просматривать товары, добавлять их в корзину, заполнять контактные данные и оформлять заказ. Проект использует модульную структуру с TypeScript для организации кода и Webpack для сборки.

## Архитектура
---

### _Шаблон проектирования_

Архитектура проекта основана на паттерне **MVP (Model-View-Presenter)**. Этот паттерн разделяет приложение на три основных слоя:

- Model (Модель) – отвечает за управление данными, бизнес-логику и взаимодействие с API.
- View (Представление) – отображает данные пользователю и реагирует на пользовательские действия.
- Presenter (Презентер) – связывает Model и View, обрабатывает действия пользователя и обновляет View.

### _Взаимодействие частей_

1. Пользователь взаимодействует с интерфейсом (View).

2. View передаёт действия пользователя в Presenter.

3. Presenter обновляет Model.

4. Model изменяет данные и сообщает об обновлении.

5. Presenter получает новые данные и обновляет View.

### _Компоненты приложения_

**Базовые абстрактные классы**

- Component<T> – базовый класс для UI-компонентов.
- Model<T> – базовый класс для работы с данными.

**Модели (Model) наследники класса Model<T>**

- AppState – глобальное состояние приложения.
- OrderModel - управляет заказами.
- BascketModel - управляет корзиной.

**Представления (View) наследники класса Component<T>**

- Page - отображение страницы.
- ProductView - отображает список товаров.
- BasketView – отображает содержимое корзины.
- ModalView - отображает модальное окно.
- FormView - отображает форму.
- OrderFormView – отображает форму заказа.
- ContactsFormView - отображает форму контактов.
- SuccessView - отбораджает окно успешного оформления.

**Серверный класс начледуется от базового класса Api**

- WebLarekApi - класс для взаимодействия с API.

## Типы данных

---
**Категории товаров**
```typescript
export type CategoryType = 
  | "дополнительное"
  | "софт-скил"
  | "кнопка"
  | "хард-скил"
  | "другое";

```
 Каждый ключ CategoryType соответствует строковому значению,
 которое используется для стилизации элемента этой категории.

```typescript
export type CategoryMap = {
  [Key in CategoryType]: string;
}
```
**Ошибки формы:** 
 * ключи — поля формы, 
 * значения — сообщения об ошибке

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>
```
**Типы форм в приложении:**
 * 'orderform' - форма оформления заказа
 * 'contactform' - форма обратной связи

```typescript
export type FormType = 'orderform' | 'contactform';
```
## Базовые классы

---

### Класс Api

Базовый класс для отправки и получения запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Конструктор:

```typescript
  constructor(baseUrl: string, options: RequestInit = {})
```

Свойства:

- `baseUrl` - базовый адрес сервера
- `options` - объект с заголовками запросов

Методы:
- принимает ответ от сервера как параметр, и обрабатывает его, возвращая результат в формате `json` или отклоненный промис с возникшей ошибкой:
```typescript
  protected handleResponse(response: Response): Promise<object>
```
- выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер:
```typescript
  get(uri: string)
```
- принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода:
```typescript
  post(uri: string, data: object, method: ApiPostMethods = 'POST') 
```

### Класс EventEmitter

Классическая реализация брокера событий. Класс EventEmitter реализует интерфейс событийной модели (паттерн "Наблюдатель") и предоставляет функционал для:

- Подписки на события
- Отписки от событий
- Генерации (эмиттинга) событий

Конструктор:

```typescript
  constructor() # инициализирует брокер событий
```
Поля:

```typescript
  _events: Map<EventName, Set<Subscriber>>
```

Методы:
- подписка на событие
`on` 
- отписка от события
`off` 
- инициализация события
`emit` 
- подписка одновременно на все события
`onAll` 
- сброс ВСЕХ обработчиков
`offAll` 
- возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
`trigger`

## Серверный класс

---

### class WebLarekApi extends Api

Специализированный класс для взаимодействия с сервером, построенный на основе базового класса Api. Он предоставляет методы для получения списка товаров и автоматически корректирует путь к изображениям, используя CDN.

Свойства:

```typescript
    readonly cdnUrl: string;
```

Конструктор:

```typescript
    constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }
```

Методы:

- Получает cписок продуктов

```typescript
async getListProducts(): Promise<IProduct[]>
```

## Классы модели данных

---
## Базовый класс
### export abstract class Model< T >

Абстрактный класс модели, предназначенный для хранения и управления данными. 

Конструктор:

```typescript
constructor(data: Partial<T>, protected events: IEvents)
```

Методы:
- Вызвать событие изменения

```typescript
emitChanges(event: string, payload?: object): void
```
---
### interface IProduct
Интерфейс, описывающий структуру объекта товара. 
```typescript
export interface IProduct{
    id: string; // Уникальный идентификатор
    title: string; // Наименование товара
    description: string; // Описание товара
    price: number | null; // Цена товара
    image: string; // Ссылка на изображение товара
    category: CategoryType; // Категория товара
    selected: boolean;
}
```
---

### interface IOrder
Интерфейс, описывающий структуру заказа.

Свойства:
```typescript
items: IProduct[] //Список товаров, включённых в заказ.
payment: string // Выбранный способ оплаты (например, "card" или "cash").
address: string // Адрес доставки.
phone: string // Номер телефона покупателя.
email: string // Электронная почта покупателя.
total: number | null // Общая сумма заказа.
```

### class OrderModel extends Model< IOrder >
Класс модели заказа, расширяющий базовую модель Model. Отвечает за хранение данных заказа, их валидацию.

Свойства:

```typescript
_valid: boolean // Флаг, указывающий, прошел ли заказ валидацию.
_errors: FormErrors // Объект, содержащий ошибки валидации по полям формы.
order: IOrder // Объект текущего заказа, инициализируется пустыми значениями.
```

Методы:
- Установить значение поля заказа и провести валидацию

```typescript
setOrderField(field: keyof IOrderForm, value: string, form: FormType): void
```

- Валидация полей доставки. Проверяет корректность способа оплаты и адреса.

```typescript
validateOrderForm(data: IOrderForm): formErrors
```
- Валидация контактных данных

```typescript
validateContactForm(data: IContactForm): formErrors
```
- Сброс текущего заказа. Очищает все поля заказа и возвращает их в исходное состояние.

```typescript
refresh(): void
```

*Геттеры:*

Возвращает текущие ошибки валидации.
```typescript
errors: FormErrors
```

Возвращает статус валидации заказа.
```typescript
valid: boolean
```

---

### class BasketModel extends Model<IProduct[]>
Модель корзины товаров. Расширяет базовую модель Model, принимает массив товаров (IProduct[]) и управляет добавлением, удалением и подсчетом стоимости, количества товаров в корзине.

Свойства:
```typescript
items: IProduct[] // Список товаров, находящихся в корзине.
countProduct: number // Общее количество товаров в корзине.
totalPrice: number // Общая стоимость всех товаров в корзине.
```

Конструктор:

Создает экземпляр корзины, инициализируя товары и рассчитывая общее количество и стоимость.

```typescript
constructor(data: IProduct[] = [], events: IEvents)
```

Методы:

- Добавляет товар в корзину и обновляет итоговые данные.

```typescript
add(product: IProduct): void
```

- Удаляет товар с заданным идентификатором из списка.

```typescript
remove(productId: string): void
```

- Возвращает текущее количество товаров в корзине.

```typescript
getCount(): number
```

- Возвращает общую сумму всех товаров в корзине.

```typescript
getTotalPrice(): number

```
- Обновить данные о количестве и стоимости.

```typescript
update(): void
```
- Очистить корзину.

```typescript
clean(): void
```
---
### class AppState extends Model<IAppState>
Класс управления состоянием приложения. Хранит и координирует взаимодействие между каталогом товаров, корзиной и заказом. Наследует общую модель Model.

Свойства:
```typescript
basket: BasketModel //Экземпляр модели корзины.
catalog: IProduct[] // Список товаров в каталоге.
order: OrderModel // Экземпляр модели заказа, в который попадают данные из корзины и формы.
```
Конструктор:

Создает глобальное состояние приложения. Инициализирует basket и order.
```typescript
constructor({}, events: IEvents)
```

Методы:

- Установить каталог товаров

```typescript
setCatalog(items: IProduct[]): void
```

- Сбросить выбор у всех товаров

```typescript
resetSelected(): void
```
- Установить список товаров в заказ

```typescript
setItemsOrder(): void

```
- Установить общую сумму заказа

```typescript
setTotalPriceOrder(): void
```

## Классы представлений

---
## Базовый класс
### abstract class Component < T >

Абстрактный класс, который предназначен для создания универсальных компонентов пользовательского интерфейса. Он предоставляет общие методы для работы с DOM-элементами.

Конструктор:

```typescript
  protected constructor(protected readonly container: HTMLElement)
```

Методы:

- Переключить класс

```typescript
  toggleClass(element: HTMLElement, className: string, force?: boolean): void
```

- Установить текстовое содержимое

```typescript
protected setText(element: HTMLElement, value: string): void
```

- Сменить статус блокировки

```typescript
setDisabled(element: HTMLElement, state: boolean): void
```

- Скрыть

```typescript
protected setHidden(element: HTMLElement): void
```

- Показать

```typescript
protected setVisible(element: HTMLElement): void
```

- Установить изображение с алтернативным текстом

```typescript
protected setImage(el: HTMLImageElement, src: string, alt?: string): void
```

- Вернуть корневой DOM-элемент

```typescript
render(data?: Partial<T>): HTMLElement
```
---

### interface IPage 
```typescript
    catalog: HTMLElement[]; 
    counter: number; // Количество добавленных товаров
```

### export class Page extends Component<IPage> 
```typescript
// Ссылки на внутренние элементы
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    protected _basketCounter: HTMLElement;
```  
Констркутор: 
```typescript
constructor(template: HTMLElement, protected events: IEvents)
```  
*Cеттеры:*

```typescript
  // Количество товаров в корзине
  set cartItemsCount(value: number)

  // Каталог товаров
  set catalog(items: HTMLElement[]) 

  // Блокировка скролла
  set scrollLock(value: boolean)

  // Счётчик корзины
  set counter(value: number)
```
---

### export class ProductListView extends Component<IProduct>

Отображает список товаров или отдельный товар.

Свойства:

```typescript
// Элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
```
Конструктор:

```typescript
constructor(template: HTMLTemplateElement, actions?: IActions)
```

*Геттеры и сеттеры:*

```typescript
// ID карточки
  set id(value: string) 
  get id(): string

// Заголовок
  set title(value: string) 
  get title(): string

// Изображение
  set image(value: string) 

// Цена
  set price(value: number | null) 

// Категория
  set category(value: CategoryType) 

// Статус выбора
  set selected(value: boolean) 
```
---

### export interface IModal 
```typescript
  content: HTMLElement;
```

### export class ModalView extends Component<IModal> 

Отвечает за управление модальными окнами, позволяет изменять их содержимое и открывать/закрывать.

```typescript
// Ссылки на внутренние элементы
private _modalElement: HTMLElement;
private _modalContent: HTMLElement;
private _closeButton: HTMLElement;
```

Конструктор:
```typescript
constructor(container: HTMLElement, protected events: IEvents)
```

Методы:
```typescript
// Открытие модального окна
    open(): void
// Закрытие модального окна
    close(): void
// Рендер модального окна
    render(data?: Partial<IModal>): HTMLElement 
```
*Сеттеры*:
```typescript
// Установка контента в модальное окно
    set content(content: HTMLElement)
```
---
### export interface IBasket 
```typescript
  list: HTMLElement[];
  price: number;
```

### export class BasketView extends Component<IBasket>

Управляет отображением корзины, добавлением/удалением товаров, вычислением общей стоимости.

```typescript
// Ссылки на внутренние элементы
  protected _title: HTMLElement;
  protected _basketList: HTMLElement;
  protected _buttonOrder: HTMLButtonElement;
  protected _basketPrice: HTMLElement;
```
*Сеттеры*:
```typescript
// Сеттер для общей цены
    set price(value: number)
// Сеттер для списка товаров 
    set list(items: HTMLElement[]) 
```
---
### export class FormView<T> extends Component<IForm>

Базовый класс для всех форм. Содержит логику валидации и обработки ошибок.

```typescript
  protected _submit: HTMLButtonElement; // кнопка отправки формы
  protected _errors: HTMLElement; // контейнер ошибок
```
Конструктор:
```typescript
constructor(protected container: HTMLFormElement, protected events: IEvents)
```
Методы:
```typescript
// Отправка события при изменении поля
protected onInputChange(field: keyof T, value: string)
```

*Сеттеры:*
```typescript
// Установка текста ошибок
    set errors(errors: FormErrors)
// Активация/деактивация кнопки отправки
    set valid (isValid: boolean) 
```
---
### export class OrderForm extends FormView<IOrderForm>

Форма заказа, наследуется от FormView. Содержит поля для ввода информации о доставке и способе оплаты.
```typescript
// Ссылки на внутренние элементы
  protected _address: HTMLInputElement;
  protected _payment: string = '';
  protected _buttons: NodeListOf<HTMLButtonElement>;
```
Методы:
```typescript
// Установка способа оплаты
    setpayment(method: string)
// Очистка формы
    clear(): void 
```

### export class ContactForm extends FormView<IContactForm>

Форма для ввода email и номера телефона, также наследуется от FormView.

```typescript

    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
```
Контейнер:
```typescript
    constructor(template: HTMLTemplateElement, protected events: IEvents)
```
Методы:
```typescript
// Очистка формы
    clear():void
```

### export class SuccessView extends Component<ISuccess>

Отображает окно с подтверждением успешного оформления заказа.

```typescript
    private _closeButton: HTMLButtonElement;
    private _successDescription: HTMLElement;
```

*Сеттеры:*
```typescript
// Установка суммы списания 
set description(value:number)
```


## Список событий в приложении

1. **Отображение списка продуктов на странице**

```typescript
  'items:show';
```

2. **Открывает модальное окно для отображения информации о выбранном продукте. Включает рендеринг продукта, обновление состояния корзины и управление кнопками в модальном окне.**

```typescript
'card:select';
```

3. **Открывает модальное окно для отображения содержимого корзины.**

```typescript
'basket:open';
```
4. **Добавляет выбранный товар в корзину**
```typescript
'basket:add';
```
5. **Удаляет выбранный товар из корзины**

```typescript
'basket:delete'';
```

6. **Открывает модальное окно для оформления заказа.**

```typescript
'order:open';
```

7. **Открывает модальное окно для ввода персональных данных.**

```typescript
'orderform:submit';
```

8. **Проверка валидации форм и установка значений заказа**

```typescript
'orderform:change';
'contactform:change';
```

9. **Открывает модальное окно для отображения сообщения об успешной оплате и оформления заказа.**

```typescript
'contactform:submit';
```

10. **Закрывает модальное окно.**

```typescript
'modal:close';
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
