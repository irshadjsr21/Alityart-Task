import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import Category from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  public isLoading = false;
  public errorMsg = '';

  private _categories = new BehaviorSubject<{
    categories: Category[];
    isLoading: boolean;
  }>({ categories: [], isLoading: false });
  public categoriesData: Category[] = [];

  public _isAddData = new BehaviorSubject<{
    isAddLoading: boolean;
    isAddError: string;
  }>({ isAddLoading: false, isAddError: '' });

  public isAddLoading = false;
  public isAddError = '';

  constructor(private http: HttpClient) {}

  get categories() {
    return this._categories.asObservable();
  }

  get isAddDataObserver() {
    return this._isAddData.asObservable();
  }

  load() {
    this.isLoading = true;
    this._categories.next({
      categories: [...this.categoriesData],
      isLoading: this.isLoading
    });

    this.http
      .get<{ categories: Category[] }>(this.apiUrl, { headers: this.headers })
      .subscribe(
        data => {
          console.log(data);
          this.categoriesData = data.categories;
          this.isLoading = false;
          this._categories.next({
            categories: [...this.categoriesData],
            isLoading: this.isLoading
          });
        },
        error => {
          console.log(error);
          this.isLoading = false;
          this._categories.next({
            categories: [...this.categoriesData],
            isLoading: this.isLoading
          });
        }
      );
  }

  addCategory(name: string) {
    this.isAddLoading = true;
    this.isAddError = '';

    this._isAddData.next({
      isAddError: this.isAddError,
      isAddLoading: this.isAddLoading
    });

    this.http
      .post<{ category: Category }>(
        this.apiUrl,
        { name },
        { headers: this.headers }
      )
      .subscribe(
        data => {
          console.log(data);
          this.categoriesData = this.categoriesData.concat(data.category);
          this._categories.next({
            categories: [...this.categoriesData],
            isLoading: false
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
}
