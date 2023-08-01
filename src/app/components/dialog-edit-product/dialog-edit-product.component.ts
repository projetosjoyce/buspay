import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductModel } from 'src/app/models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.scss'],
  standalone: true,
  imports: [ProductFormComponent, FormsModule, CommonModule, NgClass],
})
export class DialogEditProductComponent {

  constructor(private modal: NgbModal){

  }
  @Input() viewmode: string = 'edit' || 'view';
  @Input() product: ProductModel | undefined;
  @Output() sendProductChanges: EventEmitter<ProductModel> = new EventEmitter();

  emitProductChanges(product: ProductModel) {
    this.sendProductChanges.emit(product);
  }

  closeModal(){
    this.modal.dismissAll()
  }
}
