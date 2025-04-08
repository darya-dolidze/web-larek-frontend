export class ViewComponent {
    protected element: HTMLElement;

    constructor(selector: string) {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error(`Элемент с селектором "${selector}" не найден.`);
        }
        this.element = el as HTMLElement;
    }

    /** Отобразить элемент */
    show() {
        this.element.style.display = "";
    }

    /** Скрыть элемент */
    hide() {
        this.element.style.display = "none";
    }

    /** Установить текст элемента */
    setText(text: string) {
        this.element.textContent = text;
    }

    /** Установить изображение (если элемент <img>) */
    setImage(src: string, alt: string = "") {
        if (this.element instanceof HTMLImageElement) {
            this.element.src = src;
            this.element.alt = alt;
        } else {
            throw new Error("setImage можно использовать только для <img> элементов.");
        }
    }
    render(data?: Partial<{ text?: string; src?: string; alt?: string }>): HTMLElement {
        if (data?.text !== undefined) {
            this.setText(data.text);
        }
        if (this.element instanceof HTMLImageElement && data?.src) {
            this.setImage(data.src, data.alt ?? "");
        }
        return this.element;
    }
}
