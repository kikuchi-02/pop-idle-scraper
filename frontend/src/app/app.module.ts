import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MemberComponent } from './member/member.component';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { UtilService } from './util.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsComponent } from './news/news.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MemberComponent,
    IdleSwitcherComponent,
    MagazineComponent,
    ChatComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
  ],
  providers: [UtilService],
  bootstrap: [AppComponent],
})
export class AppModule {}
