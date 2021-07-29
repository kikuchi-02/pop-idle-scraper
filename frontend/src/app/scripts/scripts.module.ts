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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { SharedModule } from '../shared/shared.module';
import { ScriptListComponent } from './script-list/script-list.component';
import { ScriptComponent } from './script/script.component';
import { BalloonComponent } from './script/text-editor/balloon/balloon.component';
import { ChatComponent } from './script/text-editor/chat/chat.component';
import { ConsoleComponent } from './script/text-editor/console/console.component';
import { ToolBoxComponent } from './script/text-editor/tool-box/tool-box.component';
import { ScriptsRoutingModule } from './scripts-routing.module';

const Inline = Quill.import('blots/inline');

interface CommentBlotAttributes {
  uuid: string;
  color: string;
}
export class CommentBlot extends Inline {
  static blotName = 'comment';
  static tagName = 'mark';

  static create(value: CommentBlotAttributes): Node {
    const node = super.create();
    node.setAttribute('data-uuid', value.uuid);
    // node.setAttribute('style', `background-color: ${value.color};`);
    return node;
  }

  static formats(node: any): CommentBlotAttributes {
    const styleString = node.getAttribute('style') || '';

    const backgroundColorStyle = styleString.includes(';')
      ? styleString
          .split(';')
          .find((style) => style.startsWith('background-color'))
      : styleString;
    const colorCode = backgroundColorStyle
      ? backgroundColorStyle.split(': ')[1]
      : '';

    const format = {} as CommentBlotAttributes;
    const uuid = node.getAttribute('data-uuid');
    if (uuid) {
      format.uuid = uuid;
    }
    // if (colorCode) {
    //   format.color = colorCode;
    // }

    return format;
  }

  format(name, value: CommentBlotAttributes): void {
    if (name === 'comment') {
      if (value) {
        if (value.uuid) {
          this.domNode.setAttribute('data-uuid', value.uuid);
        } else {
          this.domNode.removeAttribute('data-uuid');
        }
        // if (value.color) {
        //   if (['#FCC933', '#FEE9B2'].includes(value.color)) {
        //     this.domNode.setAttribute(
        //       'style',
        //       `background-color: ${value.color};`
        //     );
        //   } else {
        //     this.domNode.removeAttribute('style');
        //   }
        // }
      } else {
        this.domNode.removeAttribute('data-uuid');
        // this.domNode.removeAttribute('style');
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(CommentBlot);
Quill.register('modules/cursors', QuillCursors);

@NgModule({
  declarations: [
    ConsoleComponent,
    ToolBoxComponent,
    BalloonComponent,
    ScriptComponent,
    ScriptListComponent,
    ChatComponent,
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
    MatTabsModule,
    SharedModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    QuillModule.forRoot({
      modules: {
        cursors: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          // ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ direction: 'rtl' }], // text direction

          // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          // [{ font: [] }],
          // [{ align: [] }],

          // ['clean'], // remove formatting button

          // ['link', 'image', 'video'], // link and image, video
        ],
      },
    }),
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
})
export class ScriptsModule {}
