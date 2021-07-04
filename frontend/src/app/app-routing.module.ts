import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';

const routes: Routes = [
  {
    path: 'members',
    loadChildren: () =>
      import('./member/member.module').then((m) => m.MemberModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'google-search',
    loadChildren: () =>
      import('./google-search/google-search.module').then(
        (m) => m.GoogleSearchModule
      ),
  },
  {
    path: 'text-editor',
    loadChildren: () =>
      import('./text-editor/text-editor.module').then(
        (m) => m.TextEditorModule
      ),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'subtitle',
    loadChildren: () =>
      import('./subtitle/subtitle.module').then((m) => m.SubtitleModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
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
