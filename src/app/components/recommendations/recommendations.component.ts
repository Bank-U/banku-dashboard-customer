import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Recommendation } from '../../services/intelligence.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent {
  @Input() recommendations: Recommendation[] = [];
  @Output() resolve = new EventEmitter<string>();
  @Output() viewAll = new EventEmitter<void>();

  getRecommendationIcon(type: string): string {
    switch (type) {
      case 'SAVINGS':
        return 'savings_outlined';
      case 'INVESTMENT':
        return 'trending_up_outlined';
      case 'BUDGETING':
        return 'account_balance_outlined';
      case 'DEBT_MANAGEMENT':
        return 'credit_card_outlined';
      default:
        return 'lightbulb_outlined';
    }
  }

  onResolve(recommendationId: string) {
    this.resolve.emit(recommendationId);
  }

  onViewAll() {
    this.viewAll.emit();
  }
} 