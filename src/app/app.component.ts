import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {catchError} from 'rxjs/operators';


const API_URL = '/api/v1/cars';

interface ICarShow {
  name: string
  cars: ICar[]
}

interface ICar {
  name: string
  model: string
}

interface IError {
  error: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  results: Observable<ICarShow[]>;
  errorMessage: Observable<IError>;

  constructor(private http: HttpClient) { 
    this.results = this.getCars();
  }

  getCars() {

    const response: ICarShow[] = require('../../mocks/complete-list-sample.json');
    return of (this.formatResponse(response))
    //return of(shows);

    // return this.http.get<ICarShow[]>('/api/v1/cars')
    //   .pipe(
    //     catchError(this.handleError),
    //     map(res => res)
    //   );
  }


  formatResponse(response) {
    
    var normalizedData = [];

    //adding unique makes 
    response.forEach((item) => {
      
      item.cars.map((carMake) => {
        
        let isMakeAlreadyAvailable = normalizedData.find(car => car.make === carMake.make);
        if(!isMakeAlreadyAvailable) {
          normalizedData.push({
            make: carMake.make,
            models: []
          });
        }
        
        normalizedData.filter((a) => {
          if (a.make === carMake.make) {
            let isMakeAlreadyAvailable = a.models.find(car => car.name === carMake.model);
            if (!isMakeAlreadyAvailable) {
              a.models.push({
                name: carMake.model || "Model Not Specified",
                shows: []
              })
            }
            a.models.forEach(function(a){
              a.shows.push({
                name: item.name
              })
            })  
          }
        })

      })
    })


    return normalizedData;
  }

  handleError(error: HttpErrorResponse) {

    this.errorMessage = error.error;
    const errorMsg = `Backend returned code ${error.status}, body was: ${error.error}`;
    return throwError(errorMsg);
  }
   
}

 // this.results = this.searchForm.controls.search.statusChanges.pipe( // Observable Form
    //   filter(value => value.length > 2),
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(query => this.http.get<YouTubeResult>(API_URL)), // Observable Http
    //   map(res => res.items)
    // );



















