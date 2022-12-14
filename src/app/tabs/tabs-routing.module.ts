import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: 'event',
        loadChildren: () =>
          import('../pages/event/event.module').then((m) => m.EventPageModule),
      },
      {
        path: 'form-guide',
        loadChildren: () =>
          import('../pages/form-guide/form-guide.module').then(
            (m) => m.FormGuidePageModule
          ),
      },
      {
        path: 'createevent',
        loadChildren: () =>
          import('../pages/createevent/createevent.module').then(
            (m) => m.CreateeventPageModule
          ),
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
