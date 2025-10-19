import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarComponent } from './components';

import { RouterOutlet } from '@angular/router';
import { UserService } from '@core/services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  imports: [NavbarComponent, RouterOutlet, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage {
  user$ = inject(UserService).user$;
}
