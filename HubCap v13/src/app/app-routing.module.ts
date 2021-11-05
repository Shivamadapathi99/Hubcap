import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard } from './shared/route-guards/app.guard';
import { CallbackComponent } from './shared/callback/callback.component';


import { MainComponent } from './shared/components/main/main.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'login/callback',
    component: CallbackComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'dashboard',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'my-queue',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'team-queue',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'create-work',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'file-search/:searchType/:searchText',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'file-search',
    component: MainComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: '404',
    component:
      NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
