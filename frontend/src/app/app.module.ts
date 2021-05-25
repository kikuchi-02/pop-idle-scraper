import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { GoogleSearchComponent } from './google-search/google-search.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MemberComponent } from './member/member.component';
import { NewsComponent } from './news/news.component';
import { NgModule } from '@angular/core';
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
  ],
  providers: [UtilService],
  bootstrap: [AppComponent],
})
export class AppModule {}
