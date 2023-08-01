import { Component } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent {
  constructor(private productService: ProductService) {}
  sendProductChanges(product: ProductModel) {
    this.productService.forceUpdateProductList(product, 'create')
  }
}
