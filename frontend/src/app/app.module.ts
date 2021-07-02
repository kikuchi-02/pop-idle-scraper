import { ACE_CONFIG, AceModule } from 'ngx-ace-wrapper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
} from '@angular-material-components/color-picker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BalloonComponent } from './text-editor/balloon/balloon.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChatComponent } from './chat/chat.component';
import { ConsoleComponent } from './text-editor/console/console.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditableDirective } from './text-editor/editable.directive';
import { EditorComponent } from './editor/editor.component';
import { GoogleSearchComponent } from './google-search/google-search.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MemberComponent } from './member/member.component';
import { NewsComponent } from './news/news.component';
import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview/preview.component';
import { SubtitleComponent } from './subtitle/subtitle.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { ToolBoxComponent } from './text-editor/tool-box/tool-box.component';
import { UtilService } from './util.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MemberComponent,
    IdleSwitcherComponent,
    MagazineComponent,
    ChatComponent,
    NewsComponent,
    GoogleSearchComponent,
    MarkdownComponent,
    PreviewComponent,
    EditorComponent,
    EditableDirective,
    SubtitleComponent,
    TextEditorComponent,
    ConsoleComponent,
    ToolBoxComponent,
    BalloonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    AceModule,
    DragDropModule,
    NgxMatColorPickerModule,
  ],
  providers: [
    UtilService,
    {
      provide: ACE_CONFIG,
      useValue: [],
    },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
