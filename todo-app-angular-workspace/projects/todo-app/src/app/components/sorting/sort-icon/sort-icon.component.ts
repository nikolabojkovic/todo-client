import { Component, Input } from '@angular/core';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SortDirection } from '../../../shared/models';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-sort-icon',
  templateUrl: './sort-icon.component.html',
  styleUrls: ['./sort-icon.component.scss']
})
export class SortIconComponent {
  @Input() sortDirection: string = '';

  public readonly SortDirection : typeof SortDirection = SortDirection;

  faSortUp = faSortUp;
  faSortDown = faSortDown;
}
