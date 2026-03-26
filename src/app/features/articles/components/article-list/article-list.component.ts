import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ArticleService } from '../../services/article.service';
import { Article } from '../../interfaces/article.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent {
  articles$: Observable<Article[]>;
  isModalOpen = false;
  articleToDeleteId: string | null = null;

  private articleService = inject(ArticleService);

  constructor() {
    this.articles$ = this.articleService.articles$;
  }

  openDeleteModal(id: string): void {
    this.articleToDeleteId = id;
    this.isModalOpen = true;
  }

  confirmDelete(): void {
    if (this.articleToDeleteId) {
      this.articleService.deleteArticle(this.articleToDeleteId);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.articleToDeleteId = null;
  }
}
