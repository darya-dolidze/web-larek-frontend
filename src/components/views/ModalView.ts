import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface IModal {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}

export class ModalView implements IModal {
    private modalElement: HTMLElement;
    private modalContent: HTMLElement;
    private closeButton: HTMLElement;
    private events: IEvents

    constructor(events: IEvents) {
        const modal = document.querySelector('.modal') as HTMLElement;
        const content = modal?.querySelector('.modal__content') as HTMLElement;
        const closeBtn = modal?.querySelector('.modal__close') as HTMLElement;

        if (!modal || !content || !closeBtn) {
            throw new Error("Модальное окно не найдено в DOM!");
        }

        this.modalElement = modal;
        this.modalContent = content;
        this.closeButton = closeBtn;
        this.events = events

        this.closeButton.addEventListener('click', () => this.close());
        this.modalElement.addEventListener('click', (event) => this.outsideClick(event));
    }

    open(): void {
        const scrollY = window.scrollY
        if (this.modalElement) {
            this.modalElement.style.position = 'absolute'; 
            this.modalElement.style.top = `${scrollY}px`;
        }
        document.body.style.overflow = 'hidden';
        this.modalElement.classList.add('modal_active');
    }

    close(): void {
        document.body.style.overflow = '';
        this.modalElement.classList.remove('modal_active');
    }

    setContent(content: HTMLElement): void {
        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(content);
        
    }

    private outsideClick(event: MouseEvent): void {
        if (event.target === this.modalElement) {
            this.close();
        }
    }

    buttonProcessing(product?: IProduct, currentBasket? : Array<IProduct>){
        const inBasketButton = this.modalContent.querySelector('.card__button') as HTMLButtonElement

        if (inBasketButton && product && currentBasket) {
        // Проверяем, есть ли продукт в корзине
            const isProductInBasket = currentBasket.some(item => item.id === product.id);

            if (isProductInBasket) {
                // Если продукт уже в корзине, блокируем кнопку и изменяем текст
                inBasketButton.disabled = true;
                inBasketButton.textContent = 'Добавлено';
            } else {
                // Если продукт не в корзине, добавляем обработчик на кнопку
                inBasketButton.addEventListener('click', () => {
                    this.events.emit('basket:add', product);
                    inBasketButton.disabled = true;
                    inBasketButton.textContent = 'Добавлено';
                });
            }
        }
    }
}