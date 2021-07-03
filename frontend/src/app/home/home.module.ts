import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewsComponent } from './news/news.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [HomeComponent, NewsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class HomeModule {}
