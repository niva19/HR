import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js'
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  isBarChart: boolean = true

  @ViewChild("BarButton") barButtonRef: any;
  @ViewChild("CircularButton") circularButtonRef: any;

  labels = [ 'MSI A320M-A-PRO MAX',
    'BIOSTAR A520M H',
    'ASROCK A520M HVS',
    'GIGABYTE A520M-H',
    'MSI B550M PRO',
    'ASROCK B450M STEEL LEGEND',
    'GIGABYTE B450 AORUS M',
    'ASUS TUF GAMING B450M PLUS II',
    'MSI B560M PRO-VDH',
  ]

  constructor() { }
  
  ngOnInit(): void {

    var retrievedObject = localStorage.getItem('customers');
    if (retrievedObject) {
      var parseData = JSON.parse(retrievedObject)

      var dataX = this.createChart(parseData)

      const barChart = new Chart('barChart', {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            label: '# items that customers have bought',
            data: dataX,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });


      const doughnutChart = new Chart('doughnutChart', {
        type: 'doughnut',
        data: {
          labels: this.labels,
          datasets: [{
            label: '# items that customers have bought',
            data: dataX,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    }    
  }

  createChart(data: any){
    var dataArray = [
      {label: 'MSI A320M-A-PRO MAX', count: 0},
      {label: 'BIOSTAR A520M H', count: 0},
      {label: 'ASROCK A520M HVS', count: 0},
      {label: 'GIGABYTE A520M-H', count: 0},
      {label: 'MSI B550M PRO', count: 0},
      {label: 'ASROCK B450M STEEL LEGEND', count: 0},
      {label: 'GIGABYTE B450 AORUS M', count: 0},
      {label: 'ASUS TUF GAMING B450M PLUS II', count: 0},
      {label: 'MSI B560M PRO-VDH', count: 0},
  ]

    for (let i = 0; i < data.length; i++) {
      const customer = data[i];
      for (let j = 0; j < this.labels.length; j++) {
        const label = this.labels[j];
        var arrayFilter = customer.items.filter((item: any) => item == label)
        for (let x = 0; x < dataArray.length; x++) {
          const dataArrayItem = dataArray[x];
          if (dataArrayItem.label == label) {
            dataArrayItem.count += arrayFilter.length
          }
        }
      }
      
    }


    var arrayX = []

    for (let i = 0; i < dataArray.length; i++) {
      const dataArrayItem = dataArray[i];
      arrayX.push(dataArrayItem.count)
    }

    return arrayX
  }

  showBar(){
    this.isBarChart = true 
    // this.barButtonRef.nativeElement.disabled = true
    // this.circularButtonRef.nativeElement.disabled = false
  }

  showCircular(){
    this.isBarChart = false
    // console.log(this.barButtonRef.nativeElement)
    // this.barButtonRef.nativeElement.disabled = false
    // this.circularButtonRef.nativeElement.disabled = true
  }

}
