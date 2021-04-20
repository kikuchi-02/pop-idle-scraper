import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './site/post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { SiteComponent } from './site/site.component';
import { TwitterComponent } from './twitter/twitter.component';
import { FormsModule } from '@angular/forms';
import { MemberComponent } from './member/member.component';
import { IdleSwitcherComponent } from './idle-switcher/idle-switcher.component';
import { MagazineComponent } from './magazine/magazine.component';
import { UtilService } from './util.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent,
    SiteComponent,
    TwitterComponent,
    MemberComponent,
    IdleSwitcherComponent,
    MagazineComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [UtilService],
  bootstrap: [AppComponent],
})
export class AppModule {}
