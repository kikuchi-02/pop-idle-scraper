import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScriptListComponent } from './script-list/script-list.component';
import { ScriptComponent } from './script/script.component';
import { BalloonComponent } from './script/text-editor/balloon/balloon.component';
import { ConsoleComponent } from './script/text-editor/console/console.component';
import { EditableDirective } from './script/text-editor/editable.directive';
import { ToolBoxComponent } from './script/text-editor/tool-box/tool-box.component';
import { ScriptsRoutingModule } from './scripts-routing.module';

@NgModule({
  declarations: [
    ConsoleComponent,
    ToolBoxComponent,
    BalloonComponent,
    EditableDirective,
    ScriptComponent,
    ScriptListComponent,
  ],
  imports: [
    CommonModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    ScriptsRoutingModule,
    MatButtonModule,
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
})
export class ScriptsModule {}
