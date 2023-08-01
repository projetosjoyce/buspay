import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogEditProductComponent } from 'src/app/components/dialog-edit-product/dialog-edit-product.component';
import { ProductModel } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: ProductModel[] = [];
  productsTable: ProductModel[] = [];
  productSearch: string = '';
  sortHistory: any = {};


  
  constructor(
    private productService: ProductService,
    private modal: NgbModal,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.productService.retrieveProduct().subscribe(
      (sucesso: any) => {
        this.productService.mergeManualandApiProducts(sucesso)
        this.products = this.productService.products;
        this.productsTable = this.productService.products;
      },
      (error) => {
        this.alertService.show('Erro ao listar produtos!!', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
      }
    );
  }

  filterTableResults(): void {
    const search = this.productSearch.toLowerCase();
    this.productsTable = this.products.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  editProduct(product: ProductModel) {
    const modalRef = this.modal.open(DialogEditProductComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.viewmode = 'edit';
    modalRef.componentInstance.sendProductChanges.subscribe(
      (product: ProductModel) => this.productService.forceUpdateProductList(product, 'edit')
    );
  }

  showProduct(product: ProductModel) {
    const modalRef = this.modal.open(DialogEditProductComponent, {
      size: 'lg',
      
    });
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.viewmode = 'view';
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      (_) => {
        this.productsTable = this.productsTable.filter((x) => x.id != id);
        this.alertService.show('Produto deletado com sucesso!!', {
          classname: 'bg-warning text-light',
          delay: 3000,
        });
      },
      (error) => {
        this.alertService.show('Erro ao deletar produto!!', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
      }
    );
  }

  sortBy(campo: string) {
    //verifica se o campo já foi ordenado para fazer a ordenação contrária em caso de click duplo no titulo da coluna
    if (this.sortHistory[campo]) {
      this.sortHistory[campo] =
        this.sortHistory[campo] === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortHistory[campo] = 'asc';
    }

    //conversão para any afim de fazer uma ordenação genérica de todos os campos
    //caso contrario precisaria criar uma função de ordenação para cada campo.
    (this.productsTable as any).sort((p1: any, p2: any) => {
      const aValue = p1[campo];
      const bValue = p2[campo];

      //fazer a ordenação do menor para o maior
      if (this.sortHistory[campo] == 'asc') {
        if (typeof aValue === typeof bValue) {
          return aValue < bValue ? -1 : 1;
        }
        return aValue < bValue ? -1 : 1;
      } else {
        if (typeof aValue === typeof bValue) {
          return aValue > bValue ? -1 : 1;
        }

        return aValue > bValue ? -1 : 1;
      }
    });
  }
}
