import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { EditorComponent } from './editor/editor.component';
import { GoogleSearchComponent } from './google-search/google-search.component';
import { HomeComponent } from './home/home.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { MemberComponent } from './member/member.component';
import { SubtitleComponent } from './subtitle/subtitle.component';

const routes: Routes = [
  {
    path: 'members',
    component: MemberComponent,
  },
  { path: 'home', component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'google-search', component: GoogleSearchComponent },
  { path: 'markdown', component: MarkdownComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'subtitle', component: SubtitleComponent },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
