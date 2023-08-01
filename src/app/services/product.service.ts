import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: ProductModel[] = [];

  url = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  createProduct(product: ProductModel): Observable<ProductModel> {
    const url = this.url;
    return this.http.post<ProductModel>(url, product);
  }

  retrieveProduct(id?: number) {
    let url = this.url;
    if (id) url = this.url + `/${id}`;

    return this.http.get(url);
  }

  updateProduct(product: ProductModel): Observable<ProductModel> {
    const url = this.url + `/${product.id}`;
    return this.http.put<ProductModel>(url, product);
  }

  deleteProduct(id: number) {
    const url = this.url + `/${id}`;
    return this.http.delete(url);
  }

  forceUpdateProductList(product: ProductModel, viewmode: string) {
    if (viewmode === 'edit') {
      let produtoIDX = this.products.findIndex((p) => p.id === product.id);
      this.products[produtoIDX] = {
        ...product,
        image: this.products[produtoIDX].image,
        rating: this.products[produtoIDX].rating,
      };
      let editProductsShared = this.sharedService.get('editProducts') || []
      editProductsShared.push(product)
      this.sharedService.set('editProducts', editProductsShared);
    } else {
      let addProductsShared = this.sharedService.get('addProducts') || []

      addProductsShared.push(product)
      this.sharedService.set('addProducts', addProductsShared);
    }
  }

  mergeManualandApiProducts(apiResponse: ProductModel[]) {
    let productsMerged = apiResponse;
    const editProducts = this.sharedService.get('editProducts')
    const addProducts = this.sharedService.get('addProducts')

    if (editProducts && editProducts.length > 0) {
      editProducts.forEach((p: any) => {
        let produtoIDX = productsMerged.findIndex((p) => p.id === p.id);
        productsMerged[produtoIDX] = {
          ...p,
          image: productsMerged[produtoIDX].image,
        };
      });
    }

    if (addProducts && addProducts.length > 0) {
      productsMerged = productsMerged.concat(addProducts);
    }

    this.products = productsMerged;
  }
}
