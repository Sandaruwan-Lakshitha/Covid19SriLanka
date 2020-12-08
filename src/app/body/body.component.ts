import { Component} from '@angular/core';
import { CovidServiceService } from '../covid-service.service';
import { Chart } from 'node_modules/chart.js';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { map, delay } from "rxjs/operators";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent{

  range = new FormGroup({
    start:new FormControl(),
    end:new FormControl()
  });

  Total:number;
  index:any;
  month:any;
  minDate:any;
  minIndex:number;
  maxIndex:number;
  maxDate:any;
  mat_date1:Date;
  mat_date2:Date;
  format_date1:String;
  format_date2:String;
  new_index1:number;
  pcr_data:any[];
  myChart2:any;
  myChart1:any;
  minCalender:Date;
  maxCalender:Date;
  show:boolean=true;
  flag:number=1;
  result:any;
  public errorMsg;

  constructor(private corona:CovidServiceService,private datepipe: DatePipe) { }

  btnClick(){
    console.log("Reset");
    this.ngOnInit();
  }

  changeDate(date:Date){
    var date_month = date.getMonth() + 1;
    var month_month:any = date.getMonth() + 1;
    var date_Date:any = date.getDate();
    if(date.getDate() < 10 || date_month < 10){
      if(date_month < 10){
        month_month = '0' + date_month;
      }
      if(date.getDate() < 10 ){
        date_Date = '0' + date.getDate();
      }
      return date.getFullYear() + '-' + month_month + '-' + date_Date;
    }
    return date.getFullYear() + '-' + month_month + '-' + date_Date;
  }

  addEvent1(event:MatDatepickerInputEvent<Date>){
    this.mat_date1 = event.value;


    console.log(this.mat_date1);
    this.format_date1 = this.changeDate(this.mat_date1);
    console.log(this.format_date1);
    for(var i=0;i <= this.index;i++){
      if(this.pcr_data[i].date.localeCompare(this.format_date1) == true){
        this.minIndex = (i-1);
        console.log(this.minIndex);
        console.log(this.pcr_data[this.minIndex].date);
        break;
      }
    }
    var j = 0;
  
    this.myChart2.destroy();
  
    this.myChart2 = new Chart("myChart2", {
      type: 'bar',
      data: {
          
          datasets: [{
              label: 'PCR Testing Data Count',
              borderWidth: 1,
              backgroundColor: "#9494b8",
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
              left: 20,
              right: 20,
              top: 10,
              bottom: 10
          }
      },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }],
          }
      }
  });
    for (let i = this.minIndex; i <= this.maxIndex; i++){
      this.myChart2.data.labels[j] = this.pcr_data[i].date;
      this.myChart2.data.datasets[0].data[j] = this.pcr_data[i].count;
      j++;
    }
    this.myChart2.update();
  }

  addEvent2(event:MatDatepickerInputEvent<Date>){
    this.mat_date2 = event.value;


    console.log(this.mat_date2);
    this.format_date2 = this.changeDate(this.mat_date2);
    console.log(this.format_date2);
    for(var i=0;i <= this.index;i++){
      if(this.pcr_data[i].date.localeCompare(this.format_date2) == true){
        this.maxIndex = (i-1);
        console.log(this.maxIndex);
        console.log(this.pcr_data[this.maxIndex].date);
        break;
      }
    }
    var j = 0;
  
    this.myChart2.destroy();
  
    this.myChart2 = new Chart("myChart2", {
      type: 'bar',
      data: {
          
          datasets: [{
              label: 'PCR Testing Data Count',
              borderWidth: 1,
              backgroundColor: "#9494b8",
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
              left: 20,
              right: 20,
              top: 10,
              bottom: 10
          }
      },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }],
          }
      }
  });
    for (let i = this.minIndex; i <= this.maxIndex; i++){
      this.myChart2.data.labels[j] = this.pcr_data[i].date;
      this.myChart2.data.datasets[0].data[j] = this.pcr_data[i].count;
      j++;
    }
    this.myChart2.update();
  }

 async ngOnInit(){
      this.result= await this.corona.getCoronaData().pipe(delay(500))
      //console.log(this.result)
     /*await this.corona.getCoronaData()*/this.result.subscribe((data)=>{
      var data = data.data;
      //console.log("Powered by Nadun Nethsara");
      //console.log(data);
      this.pcr_data = data.daily_pcr_testing_data;
      this.index = data.daily_pcr_testing_data.length - 1;
      this.minDate = data.daily_pcr_testing_data[0].date;
      this.maxDate = data.daily_pcr_testing_data[this.index].date;
      this.minCalender = data.daily_pcr_testing_data[0].date;
      this.maxCalender = data.daily_pcr_testing_data[this.index].date;
      this.minIndex = 0;
      this.maxIndex = this.index;

      this.cards[0].value = data.local_total_cases;
      this.cards[2].value = data.local_deaths;
      this.cards[3].value = data.local_recovered;
      this.cards[1].value = data.local_active_cases;
      this.cards[4].value = ((data.local_deaths/data.local_total_cases)*100).toFixed(2) + "%";
      this.cards[5].value = ((data.local_recovered/data.local_total_cases)*100).toFixed(2) + "%";


      this.Total = data.local_deaths + data.local_recovered + data.local_active_cases;
      this.myChart1.data.datasets[0].data[1] = (data.local_deaths/this.Total)*100;
      this.myChart1.data.datasets[0].data[2] = (data.local_recovered/this.Total)*100;
      this.myChart1.data.datasets[0].data[0] = (data.local_active_cases/this.Total)*100;
      this.myChart1.update();
      
      
      var j = 0;
      for (let i = 0; i <= this.index; i++){
       this.myChart2.data.labels[j] = data.daily_pcr_testing_data[i].date;
       this.myChart2.data.datasets[0].data[j] = data.daily_pcr_testing_data[i].count;
        j++;
      }
      this.myChart2.update();
      
    },error =>{
      this.errorMsg = error;
      this.show=false;
      console.log("this.show is "+ this.show)
    })

    //console.log("test")
    this.myChart1 = new Chart("myChart1", {
      type: 'doughnut',
      data: {
          labels: ['Active Cases', 'Deaths','Recovered'],
          datasets: [{
              //label: ' Votes',
              backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        layout: {
          padding: {
              left: 20,
              right: 20,
              top: 10,
              bottom: 10
          }
      },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

  this.myChart2 = new Chart("myChart2", {
    type: 'bar',
    data: {
        
        datasets: [{
            label: 'PCR Testing Data Count',
            borderWidth: 1,
            backgroundColor: "#9494b8",
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
        }
    },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
        }
    }
});
//console.log("test2")
  }

  public cards = [
    {head:"Confirmed Cases",clr:"#ffcccc",value:""},
    {head:"Active Cases",clr:"#80b3ff",value:""},
    {head:"Deaths",clr:"#ffb380",value:""},
    {head:"Recovered",clr:"#66ffb3",value:""},
    {head:"Death Rate",clr:"#ffccff",value:""},
    {head:"Recovery Rate",clr:"#e5e5cc",value:""},
  ];

  public PCRdata:any[];

}


