import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Hello world!</h1>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Product classification';
}
