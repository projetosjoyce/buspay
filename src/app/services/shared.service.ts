import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  //service para armazenar dados alterados e criados manualmente
  //pois a API sempre retorna as mesmas informações quando chamada.
  //foi criada afim de tornar a experiencia mais real.
  private data: any;

  constructor() {
    this.data = {};
  }

  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    this.data = null;
    if (sessionStorage.getItem(key))
      this.data = JSON.parse(sessionStorage.getItem(key) ?? '');
    return this.data;
  }

  remove(key: string) {
    return sessionStorage.removeItem(key);
  }

  ngOnInit() {
    this.data = JSON.parse(sessionStorage.getItem('shared-data') ?? '');
  }

  ngDoCheck() {
    sessionStorage.setItem('shared-data', JSON.stringify(this.data));
  }
}
