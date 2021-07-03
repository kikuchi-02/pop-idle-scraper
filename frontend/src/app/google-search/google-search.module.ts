import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleSearchRoutingModule } from './google-search-routing.module';
import { GoogleSearchComponent } from './google-search.component';

@NgModule({
  declarations: [GoogleSearchComponent],
  imports: [
    CommonModule,
    GoogleSearchRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class GoogleSearchModule {}
