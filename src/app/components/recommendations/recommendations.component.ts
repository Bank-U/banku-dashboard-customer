import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntelligenceData, IntelligenceService, Recommendation } from '../../services/intelligence.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule
  ]
})
export class RecommendationsComponent implements OnInit {
  @Input() mode: 'light' | 'full' = 'full';
  recommendations: Recommendation[] = [];
  showApplied = false;

  constructor(
    private intelligenceService: IntelligenceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecommendations();
  }

  get filteredRecommendations(): Recommendation[] {
    return this.recommendations.filter(rec => this.showApplied || !rec.resolved);
  }

  private loadRecommendations() {
    this.intelligenceService.getIntelligenceData().subscribe({
      next: (intelligenceData: IntelligenceData) => {
        this.recommendations = intelligenceData.recommendations;
      },
      error: (error: Error) => {
        console.error('Error loading recommendations:', error);
      }
    });
  }

  onResolve(recommendationId: string) {
    if (this.mode === 'light') return;
    
    this.intelligenceService.resolveRecommendation(recommendationId).subscribe({
      next: () => {
        this.loadRecommendations();
      },
      error: (error: Error) => {
        console.error('Error resolving recommendation:', error);
      }
    });
  }

  onViewAll() {
    this.router.navigate(['/intelligence']);
  }

  getRecommendationIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'savings':
        return 'savings';
      case 'investment':
        return 'trending_up';
      case 'optimization':
        return 'auto_graph';
      default:
        return 'lightbulb';
    }
  }
} 