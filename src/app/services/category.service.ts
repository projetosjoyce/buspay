import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  url = 'https://fakestoreapi.com/products/categories';

  retrieveCategories(): Observable<string[]> {
    let url = this.url;

    return this.http.get<string[]>(url);
  }
}
