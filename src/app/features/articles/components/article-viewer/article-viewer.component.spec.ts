import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ArticleViewerComponent } from './article-viewer.component';

describe('ArticleViewerComponent', () => {
  let component: ArticleViewerComponent;
  let fixture: ComponentFixture<ArticleViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [ArticleViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
