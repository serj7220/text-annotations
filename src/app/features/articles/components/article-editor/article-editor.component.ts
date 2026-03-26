import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ArticleService } from '../../services/article.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-article-editor',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './article-editor.component.html',
  styleUrl: './article-editor.component.css',
})
export class ArticleEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  articleForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', Validators.required],
  });

  isEditMode = false;
  currentArticleId: string | null = null;

  ngOnInit(): void {
    this.currentArticleId = this.route.snapshot.paramMap.get('id');

    if (this.currentArticleId && this.currentArticleId !== 'new') {
      this.isEditMode = true;
      const article = this.articleService.getArticleById(this.currentArticleId);

      if (article) {
        this.articleForm.patchValue({
          title: article.title,
          content: article.content,
        });
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    const { title, content } = this.articleForm.value;

    if (this.isEditMode && this.currentArticleId) {
      this.articleService.updateArticle(
        this.currentArticleId,
        title!,
        content!,
      );
    } else {
      this.articleService.createArticle(title!, content!);
    }

    this.router.navigate(['/']);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
