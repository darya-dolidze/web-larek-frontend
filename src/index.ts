import './scss/styles.scss';
import { ProductListView } from "./components/views/ProductView";
import { ModalView } from './components/views/ModalView';
import { BasketView } from './components/views/BasketView';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL } from "./utils/constants"; // API_URL из .env
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct } from "./types";
import { ApiModel } from "./components/models/ApiModel";
import { EventEmitter } from './components/base/events';
import { OrderForm } from './components/views/OrderFormView';
import { PersonalInfoForm } from './components/views/PersonalInfoForm';
import { SuccessView } from './components/views/SuccesssView';

const api = new ApiModel( API_URL, CDN_URL);
// Шаблоны
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardCatalogPreview = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const personalInfoTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;


const catalog = ensureElement<HTMLElement>('.gallery');
const events = new EventEmitter();

// Представления
const viewProductList = new ProductListView(cardCatalogTemplate);
const viewProduct = new ProductListView(cardCatalogPreview);
const basketView = new BasketView(basketTemplate, events);
const modalView = new ModalView(events);

// Отображение списка продуктов
api.getListProducts()
    .then((products) => {
        products.forEach(product => {
            const productElement = viewProductList.renderProduct(product);
            productElement.addEventListener('click', () => {
                events.emit('card:select', product);
            });
            catalog.appendChild(productElement);
        });
    })
    .catch(error => console.error("Ошибка загрузки продуктов:", error));


// Открытие модального окна для одного продукта
events.on('card:select', (product) => {

    const item = viewProduct.renderProduct(product as IProduct);
    const currentBasket = basketView.listElementBasket()
    modalView.setContent(item);
    modalView.buttonProcessing(product as IProduct, currentBasket);
    modalView.open();
});

// Открытие модального окна для корзины
events.on('basket:open', () => {

    modalView.setContent(basketView.render());
    modalView.open();
});

// Открытие модального окна для оформления заказа
events.on('order:open', () => {
    const orderView = new OrderForm(orderTemplate, events)
    modalView.setContent(orderView.render());
    modalView.open();
});

// Открытие окна для заполнения персональных данных
events.on('personalInfo:open', () => {
    const personalInfoView = new PersonalInfoForm (personalInfoTemplate, events)
    modalView.setContent(personalInfoView.render());
    modalView.open();
});

// Открытие окна для успешной оплаты

events.on('success:open', () => {
    const sumProducts = basketView.getSumAllProducts();
    const successView = new SuccessView(successTemplate, events, sumProducts);
    modalView.setContent(successView.render());
    basketView.renderHeaderBasketCounter(0);
    basketView.clearBasket();
    modalView.open();
});

// Закрытие модального окна
events.on('model:close', () => {
    modalView.close();
});