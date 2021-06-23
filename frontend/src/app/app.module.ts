import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleSearchComponent } from './google-search/google-search.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MemberComponent } from './member/member.component';
import { NewsComponent } from './news/news.component';
import { NgModule } from '@angular/core';
import { UtilService } from './util.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AceModule, ACE_CONFIG } from 'ngx-ace-wrapper';
import { MarkdownComponent } from './markdown/markdown.component';
import { PreviewComponent } from './preview/preview.component';
import { EditorComponent } from './editor/editor.component';
import { EditableDirective } from './editor/editable.directive';
import { SubtitleComponent } from './subtitle/subtitle.component';

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
  ],
  providers: [
    UtilService,
    {
      provide: ACE_CONFIG,
      useValue: [],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
