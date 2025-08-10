import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NavbarComponent } from './components';

import { User } from '@core/models';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  // styleUrls: ['./layout.page.scss'],
  imports: [NavbarComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage {
  user = input.required<User>();
}
