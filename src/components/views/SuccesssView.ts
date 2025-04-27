import { IActions } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface ISuccess {
  description: number;
}


export class SuccessView extends Component<ISuccess> {

    private _closeButton: HTMLButtonElement;
    private _successDescription: HTMLElement;

    constructor(template: HTMLTemplateElement,
        private events: IEvents, 
        actions?:IActions) 
        {
        const container = template.content.cloneNode(true) as HTMLElement;
        super(container);
        
        this._successDescription = this.container.querySelector('.order-success__description') as HTMLButtonElement;
        this._closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
        
        if (actions?.onClick) {
            if (this._closeButton) {
                this._closeButton.addEventListener('click', actions.onClick)
            }
        }
    }

    set description (value:number){
        this._successDescription.textContent = `Списано ${value ?? '0 синапсов'}`;
    }
    

}