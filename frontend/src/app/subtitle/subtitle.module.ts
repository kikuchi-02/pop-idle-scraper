import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { SubtitleRoutingModule } from './subtitle-routing.module';
import { SubtitleComponent } from './subtitle.component';

@NgModule({
  declarations: [SubtitleComponent],
  imports: [
    CommonModule,
    SharedModule,
    SubtitleRoutingModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class SubtitleModule {}