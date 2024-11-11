import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LanguageSelectorComponent } from './app/Components/language-selector/language-selector.component';
import { TableComponent } from './app/Components/table/table.component';

bootstrapApplication(AppComponent,appConfig)
  .catch((err) => console.error(err));
