import { AfterViewInit, Component, EventEmitter, forwardRef, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormDetails } from '../../data-interface';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../language.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSelectModule,
    CommonModule,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [HttpClient],
})
export class TableComponent implements AfterViewInit {
  constructor(
    private languageService: LanguageService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   const data = JSON.parse(params['data']);
    //   this.dataSource.data = [data]; // Wrap the object in an array
    // });
  }
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'address',
    'phone',
    'actions',
  ];
  @Input() tableData: FormDetails[] = [];
  @Output() delete = new EventEmitter<number>();
  dataSource : MatTableDataSource<FormDetails>= new MatTableDataSource<FormDetails>(this.tableData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges() {
    this.dataSource.data = this.tableData;
  }
  deletePerson(id: number) {
    this.languageService.deleteFormData(id).subscribe(
      () => {
        // Remove the person from the local array
        this.tableData = this.tableData.filter((person) => person.id !== id);
        this.dataSource.data = this.tableData;
        this.toastr.success('Person deleted successfully!');
      },
      (error) => {
        console.error('Error deleting person', error);
        this.toastr.error('Error deleting person!');
      }
    );
  }
  ngOnInit() {
    console.log('table initialted');
    this.languageService.getFormData().subscribe((data) => {
      this.tableData = data;
      console.log('table Data', this.tableData);
      this.dataSource.data = this.tableData; 
    console.log('Table Data', this.tableData);
    });
  }
}
