import { Routes } from '@angular/router';
import { LanguageSelectorComponent } from './Components/language-selector/language-selector.component';
import { TableComponent } from './Components/table/table.component';

 
export const routes: Routes = [
  {path: '',component: LanguageSelectorComponent },
  { path: 'table', component: TableComponent },
];


