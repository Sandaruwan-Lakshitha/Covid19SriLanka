import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidServiceService {

  constructor(private http:HttpClient) { }

   getCoronaData():Observable<any>{
    //https://api.covid19api.com/total/dayone/country/sri-lanka
    const url = "https://hpb.health.gov.lk/api/get-current-statistical";
    return  this.http.get<any>(url)
                .pipe(catchError(this.errorHandler))
  
  }

  errorHandler(error : HttpErrorResponse){
    return throwError(error.message || "Server Error");
  }
}
