import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
} from '@angular-material-components/color-picker';

import { BalloonComponent } from './balloon/balloon.component';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console/console.component';
import { EditableDirective } from './editable.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { TextEditorComponent } from './text-editor.component';
import { TextEditorRoutingModule } from './text-editor-routing.module';
import { ToolBoxComponent } from './tool-box/tool-box.component';

@NgModule({
  declarations: [
    TextEditorComponent,
    ConsoleComponent,
    ToolBoxComponent,
    BalloonComponent,
    EditableDirective,
  ],
  imports: [
    CommonModule,
    NgxMatColorPickerModule,
    TextEditorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
})
export class TextEditorModule {}
