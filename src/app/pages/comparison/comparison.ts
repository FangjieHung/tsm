import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SymbolComponent } from '../../shared/symbol/symbol';

@Component({
  selector: 'app-comparison-page',
  imports: [RouterLink, SymbolComponent],
  templateUrl: './comparison.html',
  styleUrl: './comparison.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonPage {}
