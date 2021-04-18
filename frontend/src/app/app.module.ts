import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './site/post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { SiteComponent } from './site/site.component';
import { SiteService } from './site/site.service';
import { TwitterComponent } from './twitter/twitter.component';
import { TwitterService } from './twitter/twitter.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, HomeComponent, PostComponent, SiteComponent, TwitterComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [SiteService, TwitterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
