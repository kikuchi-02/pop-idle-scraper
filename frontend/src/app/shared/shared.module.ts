import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContenteditableDirective } from './contenteditable/contenteditable.directive';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  declarations: [
    IdleSwitcherComponent,
    MagazineComponent,
    ContenteditableDirective,
  ],
  exports: [IdleSwitcherComponent, MagazineComponent],
})
export class SharedModule {}
