import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import Category from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category-bar',
  templateUrl: './category-bar.component.html',
  styleUrls: ['./category-bar.component.scss']
})
export class CategoryBarComponent implements OnInit, OnDestroy {
  private static allCategoryItem = {
    id: '',
    name: 'All',
    createdAt: '',
    updatedAt: ''
  } as Category;

  private categorySubscription?: Subscription;
  public categories: Category[];
  public selectedCategory = '';
  public isLoading = false;

  public showAddCategory = false;
  public addFormData: FormGroup;

  public isAddLoading = false;
  public isAddError = '';

  private addDataSubscription?: Subscription;
  private deleteCategorySubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categories = [{ ...CategoryBarComponent.allCategoryItem }];
    this.addFormData = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categories = this.categoryService.categoriesData;
    this.isLoading = this.categoryService.isLoading;
    this.categorySubscription = this.categoryService.categories.subscribe(
      data => {
        this.categories = [
          { ...CategoryBarComponent.allCategoryItem },
          ...data.categories
        ];
        this.isLoading = data.isLoading;
        console.log(this.isLoading);
      }
    );

    this.isAddLoading = this.categoryService.isAddLoading;
    this.isAddError = this.categoryService.isAddError;
    this.addDataSubscription = this.categoryService.isAddDataObserver.subscribe(
      data => {
        this.isAddLoading = data.isAddLoading;
        this.isAddError = data.isAddError;
        if (!this.isAddLoading && this.showAddCategory) {
          this.showAddCategory = false;
        }
      }
    );

    this.deleteCategorySubscription = this.categoryService.deleteCategoryObserver.subscribe(
      deletedId => {
        if (this.selectedCategory === deletedId) {
          this.selectedCategory = '';
          this.productService.setCategoryId(this.selectedCategory);
        }
      }
    );

    this.categoryService.load();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }
    if (this.addDataSubscription) {
      this.addDataSubscription.unsubscribe();
    }
  }

  public onClick(category: Category) {
    this.selectedCategory = category.id;
    this.productService.setCategoryId(this.selectedCategory);
  }

  public onAddOpen() {
    console.log('On Add');
    this.showAddCategory = true;
  }

  public onAddClose() {
    console.log('On Add Close');
    this.showAddCategory = false;
  }

  public onAddSubmit() {
    console.log(this.addFormData.value.name);
    this.categoryService.addCategory(this.addFormData.value.name);
  }
}
