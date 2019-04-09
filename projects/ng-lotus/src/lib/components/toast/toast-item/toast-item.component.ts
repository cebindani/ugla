import { Component, EventEmitter, Input, OnInit, Output, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'lts-toast-item',
  templateUrl: './toast-item.component.html',
  styleUrls: ['./toast-item.component.scss']
})
export class ToastItemComponent implements OnInit, AfterViewInit {

  private _message: any;

  @Input()
  get message() {
    return this._message;
  }

  set message(newMessage) {
    if (this._message === newMessage) { return; }
    this._message = newMessage;
  }

  @Input() messageType: string;
  @Input() index: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() onShow: EventEmitter<any> = new EventEmitter();

  timeout: any;
  icon: string;
  isOpened: boolean;
  isClosing = false;

  constructor(private element: ElementRef) {}

  ngOnInit() {

    switch (this.messageType) {
      case 'success':
        this.icon = 'check_circle_outline';
        break;
      case 'error':
        this.icon = 'highlight_off';
        break;
      case 'warning':
        this.icon = 'error_outline';
        break;
      default:
        this.icon = 'info_outline';
    }

    this.isOpened = !this.isClosing;
    this.autoClose();
  }

  closeToast(messageId) {
    this.isClosing = true;
    this.isOpened = false;
    clearTimeout(this.timeout);
    this.close.emit(messageId);
  }

  autoClose() {
    if (this.messageType !== 'error') {

      this.timeout = setTimeout(() => {
        this.closeToast(this.message.id);
      }, (this.message.timeout || 3000));
    }
  }

  ngAfterViewInit() {
    (this.element.nativeElement as HTMLDivElement).querySelector<'h2'>('h2').focus();
    this.onShow.emit(this.element);
  }
}