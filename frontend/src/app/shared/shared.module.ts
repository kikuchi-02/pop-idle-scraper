import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AceModule, ACE_CONFIG } from 'ngx-ace-wrapper';
import { ChatComponent } from './chat/chat.component';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { MarkdownComponent } from './markdown/markdown.component';

@NgModule({
  imports: [CommonModule, FormsModule, AceModule],
  declarations: [
    IdleSwitcherComponent,
    MagazineComponent,
    MarkdownComponent,
    ChatComponent,
  ],
  exports: [
    IdleSwitcherComponent,
    MagazineComponent,
    MarkdownComponent,
    ChatComponent,
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: [],
    },
  ],
})
export class SharedModule {}
