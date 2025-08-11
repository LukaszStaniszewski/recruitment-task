import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '@core/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  currentUser = input.required<User>();
}
