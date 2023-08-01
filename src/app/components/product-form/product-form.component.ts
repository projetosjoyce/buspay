import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ProductModel } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  @Input() product!: ProductModel | undefined;
  @Input() viewmode: string = 'edit' || 'view';
  categories: string[] = [];

  @Output() sendProductChanges: EventEmitter<ProductModel> = new EventEmitter();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private modal: NgbModal,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.categoryService.retrieveCategories().subscribe((sucesso) => {
      this.categories = sucesso;
    });

    this.initializeForm();
  }

  initializeForm() {
    this.productForm = new FormGroup({
      title: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    if (this.product) {
      this.productService
        .retrieveProduct(this.product.id)
        .subscribe((product: any) => {
          let productSelected = product;
          let productChanged = this.productService.products.filter(
            (p) => p.id === this.product?.id
          )[0];

          if (productChanged) productSelected = productChanged;

          this.productForm.patchValue({
            title: productSelected.title,
            price: productSelected.price,
            image: productSelected.image,
            category: productSelected.category,
            description: productSelected.description,
          });

          if (this.viewmode == 'view') {
            this.titleForm?.disable();
            this.priceForm?.disable();
            this.imageForm?.disable();
            this.categoryForm?.disable();
            this.descriptionForm?.disable();
          }
        });
    }
  }

  get titleForm() {
    return this.productForm.get('title');
  }

  get priceForm() {
    return this.productForm.get('price');
  }

  get imageForm() {
    return this.productForm.get('image');
  }

  get categoryForm() {
    return this.productForm.get('category');
  }

  get descriptionForm() {
    return this.productForm.get('description');
  }

  sendProduct(product: ProductModel) {
    if (this.viewmode == 'edit') {
      if (this.product) {
        const id = (this.product as any).id;
        product.id = id;
      }
      this.productService.updateProduct(product).subscribe(
        (sucesso) => {
          this.alertService.show('Produto atualizado com sucesso!!', {
            classname: 'bg-success text-light',
            delay: 3000,
          });
          this.sendProductChanges.emit(sucesso);
        },
        (erro) => {
          this.alertService.show('Erro ao atualizar produto!!', {
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        },
        () => {
          this.productForm.reset();
          this.modal.dismissAll();
        }
      );
    }

    if (this.viewmode == 'create') {
      this.productService.createProduct(product).subscribe(
        (sucesso) => {
          this.alertService.show('Produto criado com sucesso!!', {
            classname: 'bg-success text-light',
            delay: 3000,
          });
          let countAdded = this.sharedService.get('addProducts')
          if (countAdded && countAdded.length > 0)
            sucesso.id = sucesso.id + countAdded.length
          this.sendProductChanges.emit(sucesso);
        },
        (erro) => {
          this.alertService.show('Erro ao criar produto!!', {
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        },
        () => {
          this.productForm.reset();
        }
      );
    }
  }
}
