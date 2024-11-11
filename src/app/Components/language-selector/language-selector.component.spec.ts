import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { LanguageService } from '../../language.service';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataInterface, FormDetails } from '../../data-interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'mockParam', // You can mock route parameters here
    },
  },
  params: of({}), // You can mock route parameters as an observable if needed
};
describe('LanguageSelectorComponent', () => {
    let component: LanguageSelectorComponent;
    let languageService: jasmine.SpyObj<LanguageService>;
    let fixture: ComponentFixture<LanguageSelectorComponent>;
    let toastr: jasmine.SpyObj<ToastrService>;
    let router: jasmine.SpyObj<Router>;
    let matStepper: MatStepper;
    let httpTestingController: HttpTestingController;
//   let langSubject: BehaviorSubject<string>;


    // Mock form groups and other necessary properties
    let firstFormGroup: FormGroup;
    let secondFormGroup: FormGroup;
    beforeEach(async () => {
            // langSubject = new BehaviorSubject<string>('en');

        firstFormGroup = new FormGroup({
          firstName: new FormControl(null),
          lastName: new FormControl(null),
        });

        secondFormGroup = new FormGroup({
          email: new FormControl(null),
          phone: new FormControl(null),
        });
        const languageServiceSpy = jasmine.createSpyObj('LanguageService', [
          'getFormData',
          'getData',
          'postData',
          'switchLanguage','resetForm'
        ]);
        const toastrSpy = jasmine.createSpyObj('ToastrService', [
          'success',
          'error',
        ]);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
          imports: [
            LanguageSelectorComponent,
            ToastrModule.forRoot(),
            ReactiveFormsModule,
            HttpClientTestingModule,
          ],
          providers: [
            { provide: LanguageService, useValue: languageServiceSpy },
            { provide: ToastrService, useValue: toastrSpy },
            { provide: Router, useValue: routerSpy },
            provideHttpClient(),
            provideAnimationsAsync(),
            { provide: ActivatedRoute, useValue: activatedRouteMock },
          ],
        }).compileComponents();

        const fixture = TestBed.createComponent(LanguageSelectorComponent);
        httpTestingController = TestBed.inject(HttpTestingController);
        component = fixture.componentInstance;
        component.firstFormGroup = firstFormGroup;
        component.secondFormGroup = secondFormGroup;
        // spyOn(component, 'loadTranslations');
        
        // Create a mock MatStepper
        matStepper = jasmine.createSpyObj('MatStepper', ['reset']);
        //   fixture.detectChanges();
        languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
           toastr = TestBed.inject(
             ToastrService
           ) as jasmine.SpyObj<ToastrService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        component.firstFormGroup = new FormBuilder().group({
      firstName: ['John'],
      lastName: ['Doe'],
      email: ['john.doe@example.com']
    });
    component.secondFormGroup = new FormBuilder().group({
      address: ['123 Main St'],
      phone: ['1234567890']
    });

    });
    afterEach(() => {
      // Verify there are no outstanding requests
      httpTestingController.verify();
    });
    it('should submit the form and handle success response', () => {
     const mockResponse: FormDetails= 
       {
         id: 1,
         firstName: 'Test Data',
         lastName: '',
         email: '',
         address: '',
         phone: '',
       }
     
    languageService.postData.and.returnValue(of(mockResponse));
    spyOn(console, 'log');

    component.submit();

    expect(languageService.postData).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      phone: '1234567890'
    });
    expect(console.log).toHaveBeenCalledWith('FOrm Submitted Successfully', mockResponse);
    expect(toastr.success).toHaveBeenCalledWith('Form Submitted Successfully!!');
    expect(router.navigate).toHaveBeenCalledWith(['table']);
    expect(component.submitted).toBeTrue();
  });

  it('should handle error response on form submission', () => {
    const mockError = { message: 'Error occurred' };
    languageService.postData.and.returnValue(throwError(mockError));
    spyOn(console, 'error');

    component.submit();

    expect(languageService.postData).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error Submitting Form',
      mockError
    );
    expect(toastr.error).toHaveBeenCalledWith('Error Submitting Form!!');
    expect(component.submitted).toBeFalse();
  });
    
    it('should call getFormData and set retrievedData with response', () => {
      const mockResponse: FormDetails[] = [
        {
          id: 1,
          firstName: 'Test Data',
          lastName: '',
          email: '',
          address: '',
          phone: '',
        },
      ];

      languageService.getFormData.and.returnValue(of(mockResponse));

      spyOn(component.retrievedData, 'set');
      spyOn(console, 'log');

      component.tableData();

      expect(languageService.getFormData).toHaveBeenCalled();
      expect(component.retrievedData.set).toHaveBeenCalledWith(mockResponse);
      expect(console.log).toHaveBeenCalledWith('Form Data', mockResponse);
    });

    it('should call switchLanguage with the selected language', () => {
      const mockEvent = {
        target: { value: 'en' } as HTMLSelectElement,
      } as unknown as Event;

      component.changeLanguage(mockEvent);

      expect(languageService.switchLanguage).toHaveBeenCalledWith('en');
    });

    it('should log the selected language value', () => {
      spyOn(console, 'log');
      const mockEvent = {
        target: { value: 'es' } as HTMLSelectElement,
      }as unknown as Event;

      component.changeLanguage(mockEvent);

      expect(console.log).toHaveBeenCalledWith('es');
      expect(languageService.switchLanguage).toHaveBeenCalledWith('es');
    });
it('should reset form groups and stepper when resetForm is called', () => {
  // Set values in form controls to simulate a form being filled
  firstFormGroup.controls['firstName'].setValue('John');
  firstFormGroup.controls['lastName'].setValue('Doe');
  secondFormGroup.controls['email'].setValue('john.doe@example.com');
  secondFormGroup.controls['phone'].setValue('123456789');

  // Call the resetForm method
  component.resetForm(matStepper);

  // Check if the form controls have been reset
//   expect(firstFormGroup.controls['firstName'].value).toBeNull();
//   expect(firstFormGroup.controls['lastName'].value).toBeNull();
//   expect(secondFormGroup.controls['email'].value).toBeNull();
//   expect(secondFormGroup.controls['phone'].value).toBeNull();

  // Check if the submitted flag was set to false
  expect(component.submitted).toBeFalse();

  // Check if the stepper's reset method was called
  expect(matStepper.reset).toHaveBeenCalled();
});
  it('should create', () => {
    expect(component).toBeTruthy();
  });
    
    it('should have a defined languageService and getFormData should be callable', () => {
      expect(languageService).toBeDefined();
      expect(languageService.getFormData).toBeDefined();
    });
it('should have a defined languageService and getData should be callable', () => {
  expect(languageService).toBeDefined();
  expect(languageService.getData).toBeDefined();
});
    it('should have a defined languageService and postData should be callable', () => {
      expect(languageService).toBeDefined();
      expect(languageService.postData).toBeDefined();
    });
    






it('should load translations and set data properties', () => {
  const mockTranslations = {
    Required: 'Required Field',
    AddressTxt: 'Address',
    DoneTxt: 'Done',
    Done: 'Done Button',
    Reset: 'Reset Button',
    TITLE: 'Form Title',
    COUNTRY_NAME: 'Country',
    STEP1: 'Personal Details',
    STEP2: 'First Name',
    LnameLabel: 'Last Name',
    EmailLabel: 'Email',
    AddressLabel: 'Address Label',
    PhoneNumber: 'Phone Number',
    Submit: 'Submit',
    nextButton: 'Next',
    previousButton: 'Previous',
    Label2: 'Label 2',
  };

  // Log before calling loadTranslations
  console.log('Calling loadTranslations...');
  component.loadTranslations('en');

    const requests = httpTestingController.match(() => true);
    console.log('All intercepted requests:', requests);
  // Log to check if any requests have been made
  console.log('Expecting an HTTP request...');
  const req = httpTestingController.expectOne('assets/i18n/en.json');
    
  // Log to confirm request found
  console.log('Request found:', req);
  expect(req.request.method).toEqual('GET'); // Confirm it was a GET request
  req.flush(mockTranslations); // Respond with mock data

  // Verify the component data properties
  expect(component.data.required).toBe('Required Field');
  expect(component.data.addressTxt).toBe('Address');
  expect(component.data.doneTxt).toBe('Done');
  expect(component.data.doneBtn).toBe('Done Button');
  expect(component.data.resetBtn).toBe('Reset Button');
  expect(component.data.title).toBe('Form Title');
  expect(component.data.country).toBe('Country');
  expect(component.data.PersonalDetails1).toBe('Personal Details');
  expect(component.data.labelFirstName).toBe('First Name');
  expect(component.data.labelLastName).toBe('Last Name');
  expect(component.data.labelEmail).toBe('Email');
  expect(component.data.labelAddress).toBe('Address Label');
  expect(component.data.labelPhone).toBe('Phone Number');
  expect(component.data.submitBtn).toBe('Submit');
  expect(component.data.nextBtn).toBe('Next');
  expect(component.data.prevBtn).toBe('Previous');
  expect(component.data.label2).toBe('Label 2');
});
it('should handle missing translation keys gracefully', () => {
  const incompleteTranslations = {
    Required: 'Required Field',
    Done: 'Done Button',
    TITLE: 'Form Title',
  };

  component.loadTranslations('en');

  const req = httpTestingController.expectOne('assets/i18n/en.json');
  req.flush(incompleteTranslations);

  // Check specific properties that were provided in the response
  expect(component.data.required).toBe('Required Field');
  expect(component.data.doneBtn).toBe('Done Button');
  expect(component.data.title).toBe('Form Title');

  // Properties not provided in the response should remain undefined
  expect(component.data.addressTxt).toBeUndefined();
  expect(component.data.labelFirstName).toBeUndefined();
  expect(component.data.labelPhone).toBeUndefined();
});

    
    
   
    
    
    
    //  it('should subscribe to lang$ and call loadTranslations when the language changes', () => {
    //    fixture.detectChanges(); // ngOnInit will be triggered

    //    // Emit a new language
    //    langSubject.next('fr');

    //    // Verify that loadTranslations is called with the correct language ('fr')
    //    expect(component.loadTranslations).toHaveBeenCalledWith('fr');
    //  });

    //  it('should call loadTranslations with the initial language when ngOnInit is triggered', () => {
    //    fixture.detectChanges(); // ngOnInit will be triggered

    //    // Verify that loadTranslations is called with the initial language ('en')
    //    expect(component.loadTranslations).toHaveBeenCalledWith('en');
    //  });
    
});
