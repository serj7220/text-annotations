import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ArticleService } from '../../services/article.service';
import { Article } from '../../interfaces/article.model';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

interface TextSegment {
  text: string;
  isAnnotation: boolean;
  color?: string;
  noteText?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-article-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TooltipDirective],
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.css'],
})
export class ArticleViewerComponent implements OnInit {
  @ViewChild('textContainer') textContainer!: ElementRef<HTMLDivElement>;

  article: Article | null = null;
  textSegments: TextSegment[] = [];
  showPopup = false;
  popupTop = 0;
  popupLeft = 0;
  selectionStart = 0;
  selectionEnd = 0;
  noteText = '';
  selectedColor = '#ffeb3b';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
    }
  }

  private loadArticle(id: string): void {
    const found = this.articleService.getArticleById(id);
    if (found) {
      this.article = found;
      this.buildTextSegments();
    } else {
      this.router.navigate(['/']);
    }
  }

  private buildTextSegments(): void {
    if (!this.article) return;

    const content = this.article.content;
    const annotations = [...this.article.annotations].sort(
      (a, b) => a.startIndex - b.startIndex,
    );

    this.textSegments = [];
    let currentIndex = 0;

    for (const ann of annotations) {
      if (ann.startIndex < currentIndex) continue;

      if (ann.startIndex > currentIndex) {
        this.textSegments.push({
          text: content.substring(currentIndex, ann.startIndex),
          isAnnotation: false,
        });
      }

      this.textSegments.push({
        text: content.substring(ann.startIndex, ann.endIndex),
        isAnnotation: true,
        color: ann.color,
        noteText: ann.noteText,
      });

      currentIndex = ann.endIndex;
    }

    if (currentIndex < content.length) {
      this.textSegments.push({
        text: content.substring(currentIndex),
        isAnnotation: false,
      });
    }
  }

  onTextSelect(): void {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      this.closePopup();
      return;
    }

    const range = selection.getRangeAt(0);
    const container = this.textContainer.nativeElement;

    if (!container.contains(range.commonAncestorContainer)) return;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const absoluteStartIndex = preSelectionRange.toString().length;
    const selectedTextLength = range.toString().length;

    if (selectedTextLength === 0 || !range.toString().trim()) return;

    this.selectionStart = absoluteStartIndex;
    this.selectionEnd = absoluteStartIndex + selectedTextLength;

    const rect = range.getBoundingClientRect();
    this.popupTop = rect.bottom + window.scrollY + 10;

    const popupWidth = 250;
    let leftPos = rect.left + window.scrollX + rect.width / 2 - popupWidth / 2;
    this.popupLeft = Math.max(10, leftPos);
    this.showPopup = true;
  }

  saveAnnotation(): void {
    if (!this.article || !this.noteText.trim()) return;

    this.articleService.addAnnotation(this.article.id, {
      startIndex: this.selectionStart,
      endIndex: this.selectionEnd,
      color: this.selectedColor,
      noteText: this.noteText.trim(),
    });

    this.loadArticle(this.article.id);
    this.closePopup();
  }

  closePopup(): void {
    this.showPopup = false;
    this.noteText = '';
    window.getSelection()?.removeAllRanges();
  }
}
