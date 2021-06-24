import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import Product from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  public isInitialLoading = false;
  public isLoading = false;
  public errorMsg = '';

  private _page = 1;
  private _lastPage = 1;
  private _hasNext = false;

  private _products = new BehaviorSubject<{
    products: Product[];
    isLoading: boolean;
    isInitialLoading: boolean;
  }>({ products: [], isLoading: false, isInitialLoading: false });
  public productsData: Product[] = [];

  public _isAddData = new BehaviorSubject<{
    isAddLoading: boolean;
    isAddError: string;
  }>({ isAddLoading: false, isAddError: '' });

  public isAddLoading = false;
  public isAddError = '';

  private _categoryId: string | undefined = undefined;

  constructor(private http: HttpClient) {}

  get products() {
    return this._products.asObservable();
  }

  get isAddDataObserver() {
    return this._isAddData.asObservable();
  }

  get categoryId() {
    return this._categoryId;
  }

  get page() {
    return this._page;
  }

  get lastPage() {
    return this._lastPage;
  }

  get hasNext() {
    return this._hasNext;
  }

  setCategoryId(category: string) {
    if (category) {
      this._categoryId = category;
    } else {
      this._categoryId = undefined;
    }
    this.load();
  }

  private _load(isFirst = false) {
    this.isLoading = true;
    if (isFirst) {
      this.isInitialLoading = true;
    }
    this._products.next({
      products: [...this.productsData],
      isLoading: this.isLoading,
      isInitialLoading: this.isInitialLoading
    });

    let url = `${this.apiUrl}?page=${this.page}`;

    if (this.categoryId) {
      url += `&categoryId=${this.categoryId}`;
    }

    this.http
      .get<{ products: Product[]; lastPage: number }>(url, {
        headers: this.headers
      })
      .subscribe(
        data => {
          console.log(data);
          if (isFirst) {
            this.productsData = data.products;
          } else {
            this.productsData = this.productsData.concat(data.products);
          }

          this._lastPage = data.lastPage;
          if (this.page < this.lastPage) {
            this._hasNext = true;
          } else {
            this._hasNext = false;
          }

          this.isLoading = false;
          this.isInitialLoading = false;
          this._products.next({
            products: [...this.productsData],
            isLoading: this.isLoading,
            isInitialLoading: this.isInitialLoading
          });
        },
        error => {
          console.log(error);
          this._page -= 1;
          this.isLoading = false;
          this.isInitialLoading = false;
          this._products.next({
            products: [...this.productsData],
            isLoading: this.isLoading,
            isInitialLoading: this.isInitialLoading
          });
        }
      );
  }

  public load() {
    this._page = 1;
    this._lastPage = 1;
    this._hasNext = false;
    this._load(true);
  }

  public loadNext() {
    if (this.hasNext) {
      this._page += 1;
      this._load();
    }
  }

  addProduct(name: string, price: number, image: string, categoryId: string) {
    this.isAddLoading = true;
    this.isAddError = '';

    this._isAddData.next({
      isAddError: this.isAddError,
      isAddLoading: this.isAddLoading
    });

    this.http
      .post<{ product: Product }>(
        this.apiUrl,
        { name, price, image, categoryId },
        { headers: this.headers }
      )
      .subscribe(
        data => {
          console.log(data);
          this.productsData = this.productsData.concat(data.product);
          this.isLoading = false;
          this._products.next({
            products: [...this.productsData],
            isLoading: this.isLoading,
            isInitialLoading: this.isInitialLoading
          });

          this.isAddLoading = false;
          this._isAddData.next({
            isAddError: this.isAddError,
            isAddLoading: this.isAddLoading
          });
        },
        error => {
          console.log(error);
          this.isAddLoading = false;
          this.isAddError = error.message;

          this._isAddData.next({
            isAddError: this.isAddError,
            isAddLoading: this.isAddLoading
          });
        }
      );
  }

  deleteProduct(id: string) {
    this.isInitialLoading = true;
    this._products.next({
      products: [...this.productsData],
      isLoading: this.isLoading,
      isInitialLoading: this.isInitialLoading
    });

    this.http
      .delete<{ product: Product }>(`${this.apiUrl}/${id}`, {
        headers: this.headers
      })
      .subscribe(
        data => {
          console.log(data);
          this.productsData = this.productsData.filter(elem => elem.id !== id);
          this.isLoading = false;
          this.isInitialLoading = false;
          this._products.next({
            products: [...this.productsData],
            isLoading: this.isLoading,
            isInitialLoading: this.isInitialLoading
          });
        },
        error => {
          console.log(error);
          this.isLoading = false;
          this.isInitialLoading = false;
          this._products.next({
            products: [...this.productsData],
            isLoading: this.isLoading,
            isInitialLoading: this.isInitialLoading
          });
        }
      );
  }
}
