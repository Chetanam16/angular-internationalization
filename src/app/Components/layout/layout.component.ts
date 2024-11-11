import { Component } from '@angular/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TableComponent } from '../table/table.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LanguageSelectorComponent,FooterComponent,HeaderComponent,TableComponent,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
