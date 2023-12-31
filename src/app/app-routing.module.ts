import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'product-register',
    loadChildren: () =>
      import('./features/product-register/product-register.module').then(
        (m) => m.ProductRegisterModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
