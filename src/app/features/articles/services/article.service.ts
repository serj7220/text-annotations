import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Article, Annotation } from '../interfaces/article.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  articles$: Observable<Article[]>;

  private readonly STORAGE_KEY = 'annotator_articles';
  private articlesSubject = new BehaviorSubject<Article[]>([]);

  constructor(private localStorageService: LocalStorageService) {
    this.articles$ = this.articlesSubject.asObservable();
    this.loadInitialData();
  }

  getArticleById(id: string): Article | undefined {
    return this.articlesSubject.getValue().find((a) => a.id === id);
  }

  createArticle(title: string, content: string): void {
    const newArticle: Article = {
      id: crypto.randomUUID(),
      title,
      content,
      annotations: [],
    };

    const currentArticles = this.articlesSubject.getValue();
    this.saveState([...currentArticles, newArticle]);
  }

  updateArticle(id: string, title: string, content: string): void {
    const currentArticles = this.articlesSubject.getValue();
    const updatedArticles = currentArticles.map((article) =>
      article.id === id ? { ...article, title, content } : article,
    );
    this.saveState(updatedArticles);
  }

  deleteArticle(id: string): void {
    const currentArticles = this.articlesSubject.getValue();
    const filteredArticles = currentArticles.filter(
      (article) => article.id !== id,
    );
    this.saveState(filteredArticles);
  }

  addAnnotation(
    articleId: string,
    annotationData: Omit<Annotation, 'id'>,
  ): void {
    const article = this.getArticleById(articleId);
    if (!article) return;

    const newAnnotation: Annotation = {
      ...annotationData,
      id: crypto.randomUUID(),
    };

    const updatedArticle = {
      ...article,
      annotations: [...article.annotations, newAnnotation],
    };

    const currentArticles = this.articlesSubject.getValue();
    const updatedArticles = currentArticles.map((a) =>
      a.id === articleId ? updatedArticle : a,
    );

    this.saveState(updatedArticles);
  }

  private loadInitialData(): void {
    const savedArticles =
      this.localStorageService.getItem<Article[]>(this.STORAGE_KEY) || [];
    this.articlesSubject.next(savedArticles);
  }

  private saveState(articles: Article[]): void {
    this.localStorageService.setItem(this.STORAGE_KEY, articles);
    this.articlesSubject.next(articles);
  }
}
