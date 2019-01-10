import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpErrorResponse, HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';

describe('AppComponent', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let mockApp: AppComponent;

  beforeEach(async(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('EnergyAustralia Coding Test');
  }));

  it('getCars should return a list if response is successfull', () => {
    const payload: any[] = require('../../mocks/complete-list-sample.json');
    httpClientSpy.get.and.returnValue(of(payload));
    mockApp = new AppComponent(<any> httpClientSpy);
    mockApp.getCars().subscribe(
      results => expect(results.length).toEqual(5)
    );
  });

  it('getCars should set an warning message if response is empty', () => {
    httpClientSpy.get.and.returnValue(of(''));
    mockApp = new AppComponent(<any> httpClientSpy);
    mockApp.getCars().subscribe(
      results => expect(results.length).toEqual(0),
      fail
    );
    expect<any>(mockApp.errorMessage).toBe('There is no data at the momment, Please try to refresh your browser');
  });

  it('getCars should return an error message when call fails', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Failed Downstream service',
      status: 400, statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(throwError(errorResponse));
    mockApp = new AppComponent(<any> httpClientSpy);
    mockApp.getCars().subscribe();
    expect<any>(mockApp.errorMessage).toBe('Failed Downstream service');
  });

});
