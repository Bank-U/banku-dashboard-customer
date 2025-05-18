import { Component, Input } from '@angular/core';
import { IntelligenceService, Recommendation } from '../../services/intelligence.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule,
    RouterLink
  ]
})
export class RecommendationsComponent {
  @Input() mode: 'light' | 'full' = 'full';
  @Input() recommendations: Recommendation[] = [];
  showApplied = false;

  constructor(
    private readonly intelligenceService: IntelligenceService,
  ) {}

  get filteredRecommendations(): Recommendation[] {
    return this.recommendations.filter(rec => this.showApplied || !rec.resolved);
  }

  onResolve(recommendationId: string) {
    if (this.mode === 'light') return;
    
    this.intelligenceService.resolveRecommendation(recommendationId).subscribe({
      next: () => {
        const recommendation = this.recommendations.find(rec => rec.id === recommendationId);
        if (recommendation) {
          recommendation.resolved = true;
        }
      },
      error: (error: Error) => {
        console.error('Error resolving recommendation:', error);
      }
    });
  }

  getRecommendationIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'savings':
        return 'savings';
      case 'investment':
        return 'trending_up';
      case 'optimization':
        return 'auto_graph';
      case 'debt_management':
        return 'payments';
      default:
        return 'lightbulb';
    }
  }
} 