import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPage {
    catalog: HTMLElement[];
    counter: number;
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    protected _basketCounter: HTMLElement;
    
    
    constructor(template: HTMLElement, protected events: IEvents){
        super(template);
        this._catalog = document.querySelector('.gallery') as HTMLElement;
        this._wrapper = document.querySelector('.page__wrapper') as HTMLElement;
        this._basket = document.querySelector('.header__basket') as HTMLElement;
        this._basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    
        this._basket.addEventListener('click', () => { this.events.emit('basket:open') });
    }

    set cartItemsCount(value: number){
        this._basketCounter.textContent = String(value);
    }

    set catalog (items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set scrollLock (value:boolean){
        if (value) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    set counter (value: number){
        this.setText(this._basketCounter, String(value))
    }
}