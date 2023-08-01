import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRegisterRoutingModule } from './product-register-routing.module';
import { ProductRegisterComponent } from './product-register.component';
import { ProductFormComponent } from 'src/app/components/product-form/product-form.component';

const STANDALONE_COMPS = [ProductFormComponent]

@NgModule({
  declarations: [
    ProductRegisterComponent
  ],
  imports: [
    CommonModule,
    ProductRegisterRoutingModule,
    STANDALONE_COMPS
  ]
})
export class ProductRegisterModule { }
