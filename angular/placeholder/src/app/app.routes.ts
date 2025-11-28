import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TemplateCreatorComponent } from './components/template-creator/template-creator.component';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { TemplateExecutorComponent } from './components/template-executor/template-executor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: TemplateCreatorComponent },
  { path: 'edit/:id', component: TemplateCreatorComponent },
  { path: 'templates', component: TemplateListComponent },
  { path: 'execute/:id', component: TemplateExecutorComponent },
  { path: '**', redirectTo: '' },
];
