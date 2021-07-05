import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [IdleSwitcherComponent, MagazineComponent, ChatComponent],
  exports: [IdleSwitcherComponent, MagazineComponent, ChatComponent],
})
export class SharedModule {}
