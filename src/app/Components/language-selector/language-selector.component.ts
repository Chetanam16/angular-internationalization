import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../../language.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DataInterface, FormDetails } from '../../data-interface';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { TableComponent } from '../table/table.component';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HeaderComponent,
    MatTableModule,
    MatSelectModule,
    TableComponent,
    RouterModule
  ],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
  providers: [HttpClient],
})
export class LanguageSelectorComponent {
  constructor(
    private languageService: LanguageService,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}
  submitted = false;
  data: DataInterface = {
    id: 0,
    title: '',
    country: '',
    PersonalDetails1: '',
    labelFirstName: '',
    labelLastName: '',
    labelEmail: '',
    labelAddress: '',
    nextBtn: '',
    prevBtn: '',
    resetBtn: '',
    doneBtn: '',
    doneTxt: '',
    addressTxt: '',
    required: '',
    labelPhone: '',
    submitBtn: '',
    label2: '',
  };
  formDetails = signal<FormDetails[]>([]);

  retrievedData = signal<FormDetails[]>([]);
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'address',
    'phone',
  ];
  private _formBuilder = inject(FormBuilder);
  isLinear = false;
  
  firstFormGroup: any = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    address: ['', Validators.required],
    phone: ['', Validators.required],
  });
  tableData() {
    this.languageService.getFormData().subscribe((res) => {
      this.retrievedData.set(res);
      console.log('Form Data', res);
    });
  }
  ngOnInit() {
    this.languageService.lang$.subscribe((lang) => {
      this.loadTranslations(lang);
    });
  
   
    // this.tableData();
  }
 
  
  loadTranslations(lang: string) {
    this.http
      .get<{ [key: string]: string }>(`assets/i18n/${lang}.json`)
      .subscribe((translations) => {
        console.log('Translations received:', translations);
        this.data.required = translations['Required'];
        this.data.addressTxt = translations['AddressTxt'];
        this.data.doneTxt = translations['DoneTxt'];
        this.data.doneBtn = translations['Done'];
        this.data.resetBtn = translations['Reset'];
        this.data.title = translations['TITLE'];
        this.data.country = translations['COUNTRY_NAME'];
        this.data.PersonalDetails1 = translations['STEP1'];
        this.data.labelFirstName = translations['STEP2'];
        this.data.labelLastName = translations['LnameLabel'];
        this.data.labelEmail = translations['EmailLabel'];
        this.data.labelAddress = translations['AddressLabel'];
        this.data.labelPhone = translations['PhoneNumber'];
        this.data.submitBtn = translations['Submit'];
        this.data.nextBtn = translations['nextButton'];
        this.data.prevBtn = translations['previousButton'];
        this.data.label2 = translations['Label2'];
      });
  }
  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log(selectElement.value);
    this.languageService.switchLanguage(selectElement.value);
  }
  submit() {
    const formData = {
      firstName: this.firstFormGroup.value.firstName,
      lastName: this.firstFormGroup.value.lastName,
      email: this.firstFormGroup.value.email,
      address: this.secondFormGroup.value.address,
      phone: this.secondFormGroup.value.phone,
    };
    this.languageService.postData(formData).subscribe(
      (res) => {
        console.log('FOrm Submitted Successfully', res);
        this.toastr.success('Form Submitted Successfully!!');
        this.router.navigate(['table']); 
        console.log("hiiii")
        this.submitted = true;
        
        // this.tableData();
        
      },
    
      (error) => {
        console.error('Error Submitting Form', error);
        this.toastr.error('Error Submitting Form!!');
      }
    );
  }
  resetForm(stepper: MatStepper) {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.submitted = false;
    stepper.reset();
  }

  statusSignal = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
}
