import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Product from '../../models/product';
import Category from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  public trashIcon = faTrashAlt;

  private categorySubscription?: Subscription;
  public categories: Category[];

  private productSubscription?: Subscription;
  public products: Product[];
  public isLoading = false;
  public isInitialLoading = false;

  public showAddProduct = false;
  public addFormData: FormGroup;

  public isAddLoading = false;
  public isAddError = '';

  private addDataSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.products = [];
    this.categories = [];
    this.addFormData = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      image: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categories = this.categoryService.categoriesData;
    this.categorySubscription = this.categoryService.categories.subscribe(
      data => {
        this.categories = [...data.categories];
      }
    );
    this.products = this.productService.productsData;
    this.isLoading = this.productService.isLoading;
    this.isInitialLoading = this.productService.isInitialLoading;
    this.productSubscription = this.productService.products.subscribe(data => {
      this.products = [...data.products];
      this.isLoading = data.isLoading;
      this.isInitialLoading = data.isInitialLoading;
    });

    this.isAddLoading = this.productService.isAddLoading;
    this.isAddError = this.productService.isAddError;
    this.addDataSubscription = this.productService.isAddDataObserver.subscribe(
      data => {
        this.isAddLoading = data.isAddLoading;
        this.isAddError = data.isAddError;
        if (!this.isAddLoading && this.showAddProduct) {
          this.showAddProduct = false;
        }
      }
    );

    this.productService.load();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    if (this.addDataSubscription) {
      this.addDataSubscription.unsubscribe();
    }
  }

  public onAddOpen() {
    console.log('On Add');
    this.showAddProduct = true;
  }

  public onAddClose() {
    console.log('On Add Close');
    this.showAddProduct = false;
  }

  public onAddSubmit() {
    this.productService.addProduct(
      this.addFormData.value.name,
      this.addFormData.value.price,
      this.addFormData.value.image,
      this.addFormData.value.categoryId
    );
  }

  public onDelete(product: Product) {
    this.productService.deleteProduct(product.id);
  }

  public onDeleteCategory() {
    console.log(this.productService.categoryId);
    if (this.productService.categoryId) {
      this.categoryService.deleteCategory(this.productService.categoryId);
    }
  }

  public onScroll() {
    console.log("Scrolled");
    this.productService.loadNext();
  }
}
