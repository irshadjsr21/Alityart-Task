import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoryBarComponent } from './components/category-bar/category-bar.component';

import { CategoryService } from './services/category.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, CategoryBarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule {}
