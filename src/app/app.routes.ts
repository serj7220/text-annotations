import { Routes } from '@angular/router';

import { ArticleListComponent } from './features/articles/components/article-list/article-list.component';
import { ArticleEditorComponent } from './features/articles/components/article-editor/article-editor.component';
import { ArticleViewerComponent } from './features/articles/components/article-viewer/article-viewer.component';

export const routes: Routes = [
  { path: '', component: ArticleListComponent },
  { path: 'edit/new', component: ArticleEditorComponent },
  { path: 'edit/:id', component: ArticleEditorComponent },
  { path: 'view/:id', component: ArticleViewerComponent },
  { path: '**', redirectTo: '' },
];
