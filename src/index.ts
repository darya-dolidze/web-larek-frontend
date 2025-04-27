import './scss/styles.scss';
import { ProductListView } from "./components/views/ProductView";
import { ModalView } from './components/views/ModalView';
import { BasketItemView, BasketView } from './components/views/BasketView';
import { Api, ApiListResponse } from "./components/base/api";
import { API_URL, CDN_URL } from "./utils/constants"; // API_URL из .env
import { ensureElement } from "./utils/utils";
import { IOrder, IProduct, formErrors } from "./types";
import { WebLarekApi } from "./components/models/ApiModel";
import { EventEmitter } from './components/base/events';
import { SuccessView } from './components/views/SuccesssView';
import { Page } from './components/views/Page';
import { AppState } from './components/models/AppData';
import { ProductModel } from './components/models/Models';
import { IOrderForm, OrderForm } from './components/views/OrderFormView';
import { ContactForm, IContactForm } from './components/views/ContactFormView';

const api = new WebLarekApi( API_URL, CDN_URL);
// Шаблоны
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardCatalogPreview = document.querySelector('#card-preview') as HTMLTemplateElement;
const modalTemplate = document.querySelector('#modal-container') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const productBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;


const events = new EventEmitter();

// Модель данных
const appData = new AppState({}, events);

// Компоненты приложения
const page = new Page(document.body, events);
const modal = new ModalView(modalTemplate, events);
const basket = new BasketView(basketTemplate, events);
const orderForm = new OrderForm(orderTemplate, events);
const contactForm = new ContactForm (contactTemplate, events)


function renderBasketView(): HTMLElement {
  const basketItems = appData.basket.items.map((item, index) => {
    const productItem = new BasketItemView(productBasketTemplate, events, {
      onClick: () => events.emit('basket:delete', item)
    });

    return productItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  return basket.render({
    list: basketItems,
    price: appData.basket.getTotalPrice(),
  });
}

api.getListProducts()
.then((products) => {
    appData.setCatalog((products))
})
.catch(error => console.error("Ошибка загрузки продуктов:", error));

// Отображение списка продуктов
events.on('items:show', () => {
  page.catalog = appData.catalog.map((item) => {
    const product = new ProductListView(cardCatalogTemplate,{
        onClick: () => events.emit('card:select', item),
    });
    return product.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
    });
  });
});

// Открытие модального окна для одного продукта
events.on('card:select', (item: ProductModel) => {
    page.scrollLock = true;
    const product = new ProductListView(cardCatalogPreview, {
        onClick: () => events.emit('basket:add', item),
    });
    const viewProduct = product.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price,
        selected: item.selected
    });
    modal.render({
        content: viewProduct
    });
});

// Добавление товаров в корзину
events.on('basket:add', (item: ProductModel) => {
    item.selected = true;
    appData.basket.add(item);
    page.counter = appData.basket.getCount();
    modal.close();
})

// Открытие модального окна для корзины
events.on('basket:open', () => {
    page.scrollLock = true;
    appData.basket.update();
    modal.render({
        content: renderBasketView()
    });
});

// Удаление товара из корзины
events.on('basket:delete', (item:ProductModel) => {
    appData.basket.remove(item.id);
    appData.basket.update();
    item.selected = false;
    page.counter = appData.basket.getCount();
    modal.render({
        content: renderBasketView()
    });
});

// Открытие модального окна для оформления заказа
events.on('order:open', () => {
    page.scrollLock = true;
    modal.render({
        content: orderForm.render(
            {
                valid: false,
                errors: []
            }
        )
    });
});

// Открытие окна для заполнения персональных данных
events.on('orderform:submit', () => {
    modal.render({
        content: contactForm.render(
            {
                valid: false,
                errors: []
            }
        )
    });
});

// Проверка валидации заказа 
// Для формы заказа
events.on('orderform:change', (data: { field: keyof IOrderForm, value: string}) => {      
    appData.order.setOrderField(data.field, data.value, 'orderform');
    orderForm.errors = appData.order.errors;
    orderForm.valid = appData.order.valid;
});

// Для формы контактов
events.on('contactform:change', (data: { field: keyof IOrderForm, value: string }) => {
    appData.order.setOrderField(data.field, data.value, 'contactform');
    contactForm.errors = appData.order.errors;
    contactForm.valid = appData.order.valid;
});

// Покупка товаров
events.on('contactform:submit', () => {
    appData.setItemsOrder()
    appData.setTotalPriceOrder()
    api.post('/order', appData.order.order)
    .then((res) => {
      events.emit('success:open', res);
      appData.basket.clean();
      appData.order.refresh();
      orderForm.clear();
      page.counter = 0;
      appData.resetSelected();
    })
    .catch((err) => {
      console.log(err)
    })
})

// Открытие окна для успешной оплаты

events.on('success:open', (res: ApiListResponse<string>) => {
    const success = new SuccessView(successTemplate, events, {
       onClick: () => events.emit('success:close') 
    })
    modal.render({
    content: success.render({
        description: res.total
    })
  })
});

// Завершение покупки 
events.on('success:close', ()=>{
    modal.close()
})

// Закрытие модального окна
events.on('modal:close', () => {
    page.scrollLock = false;
    appData.order.refresh();
    orderForm.clear();
    contactForm.clear();
});