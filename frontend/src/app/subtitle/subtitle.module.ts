import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { SharedModule } from '../shared/shared.module';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { WarningBlot } from './quill-module';
import { SubtitleRoutingModule } from './subtitle-routing.module';
import { SubtitleComponent } from './subtitle.component';
import { WarningBallonComponent } from './warning-ballon/warning-ballon.component';

Quill.register(WarningBlot);

@NgModule({
  declarations: [
    SubtitleComponent,
    DictionaryComponent,
    WarningBallonComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubtitleRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    QuillModule.forRoot({ modules: { toolbar: false } }),
    OverlayModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
})
export class SubtitleModule {}
