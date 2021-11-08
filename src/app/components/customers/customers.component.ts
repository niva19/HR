import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild, ViewChildren, Inject, ElementRef, OnInit} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface DialogData {
  id: number;
  name: string;
  lastName: string;
  email: string;
  type: string;
  isEditing: boolean
}

export interface DialogItemData {
  items: string[];
}

export interface Customer {
  id: number;
  name: string;
  lastName: string;
  email: string;
  type: string;
  items: string[];
}

const ELEMENT_DATA: Customer[] = [
  {id: 8749, name: 'Sherri', lastName: 'Morse', email: 'M.Sherri@gmail.com', type: '1', items: ['GIGABYTE B450 AORUS M', 'MSI B550M PRO',]},
  {id: 4046, name: 'Thornton', lastName: 'Woodward', email: 'W.Thornton@gmail.com', type: '2', items: ['MSI B550M PRO', 'ASROCK B450M STEEL LEGEND', 'GIGABYTE A520M-H', 'MSI B560M PRO-VDH', 'BIOSTAR A520M H', 'GIGABYTE B450 AORUS M',]},
  {id: 5900, name: 'Julian ', lastName: 'Merrill', email: 'M.Julian@gmail.com',  type: '2', items: ['ASROCK B450M STEEL LEGEND','MSI B560M PRO-VDH','MSI A320M-A-PRO MAX','MSI B550M PRO','ASROCK A520M HVS','GIGABYTE B450 AORUS M','BIOSTAR A520M H',]},
  {id: 2336, name: 'Dixie', lastName: 'Hill', email: 'H.Dixie@gmail.com', type: '1', items: ['ASUS TUF GAMING B450M PLUS II','MSI B560M PRO-VDH','ASROCK B450M STEEL LEGEND','BIOSTAR A520M H','MSI B550M PRO',] },
  {id: 9265, name: 'Luvinia', lastName: 'Penn', email: 'P.Luvinia@gmail.com', type: '1', items: ['MSI B550M PRO','MSI A320M-A-PRO MAX','GIGABYTE B450 AORUS M',] },
  {id: 5446, name: 'Robert', lastName: 'Weekes', email: 'W.Robert@gmail.com', type: "2", items: ['MSI B560M PRO-VDH','BIOSTAR A520M H',] },
  {id: 7445, name: 'Alvena', lastName: 'Kimberley', email: 'K.Alvena@gmail.com', type: "1", items: ['ASROCK B450M STEEL LEGEND','ASUS TUF GAMING B450M PLUS II','BIOSTAR A520M H','MSI A320M-A-PRO MAX',] },
  {id: 6989, name: 'Flora', lastName: 'Honeycutt', email: 'H.Flora@gmail.com', type: "2", items: ['MSI A320M-A-PRO MAX','ASROCK B450M STEEL LEGEND','MSI B550M PRO',] },
  {id: 5595, name: 'Jemma', lastName: 'Church', email: 'C.Jemma@gmail.com', type: "2", items: ['MSI A320M-A-PRO MAX','ASROCK B450M STEEL LEGEND','GIGABYTE A520M-H',] },
];

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements AfterViewInit, OnInit {
  
  @ViewChildren("checkboxs") private checkboxsRef: any;
  @ViewChild("RemoveButton") removeButtonRef: any;
  @ViewChild("DetailsButton") detailsButtonRef: any;
  @ViewChild("AddItemsButton") addItemsButtonRef: any;
  @ViewChild("AddButton") addButtonRef: any;

  id: number;
  name: string;
  lastName: string;
  email: string;
  type: string;

  currentCustomer: Customer

  displayedColumns: string[] = ['select', 'id', 'name', 'lastName', 'email'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {}
  
  ngOnInit(): void {
    var retrievedObject = localStorage.getItem('customers');
    if (retrievedObject) {
      var parseData = JSON.parse(retrievedObject)
      this.dataSource = new MatTableDataSource(parseData);
    }
    else {
      localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));
    }
  }

  resetData() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));
  }

  checkboxValidator(row: Customer, event: any) {

    this.removeButtonRef._disabled = this.detailsButtonRef._disabled = this.addItemsButtonRef._disabled = !event.checked
    this.addButtonRef._disabled = event.checked

    var currentId = event.source.id

    for (let i = 0; i < this.checkboxsRef._results.length; i++) {
      if (this.checkboxsRef._results[i].id != currentId) {
        this.checkboxsRef._results[i]._disabled = event.checked
      }
    }

    if (event.checked) {
      this.currentCustomer = row
    }
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialog, {
      disableClose: true,
      width: '500px',
      data: { id: this.id,
              name: this.name,
              lastName: this.lastName,
              email: this.email,
              type: this.type,
              isEditing: false
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var newCustomer: Customer = {
          id: parseInt(result.id),
          name: result.name,
          lastName: result.lastName,
          email: result.email,
          type: result.type,
          items: []
        }
        this.dataSource.filteredData.push(newCustomer)
        this.dataSource.sort = this.sort

        localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));
      }
    });
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  removeData() {
    var newArr = this.removeItemAll(this.dataSource.filteredData, this.currentCustomer.id)
    this.dataSource = new MatTableDataSource(newArr);

    for (let i = 0; i < this.checkboxsRef._results.length; i++) {
      this.checkboxsRef._results[i]._disabled = false
    }

    this.dataSource.sort = this.sort
    this.removeButtonRef._disabled = this.detailsButtonRef._disabled = this.addItemsButtonRef._disabled = true
    this.addButtonRef._disabled = false

    localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));
  }

  removeItemAll(arr: any, value: any) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i].id == value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  addItems(){
    const dialogRef = this.dialog.open(AddItemDialog, {
      disableClose: true,
      width: '500px',
      data: { 
              items: this.currentCustomer.items
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        for (let i = 0; i < this.dataSource.filteredData.length; i++) {
          if (this.dataSource.filteredData[i].id == this.currentCustomer.id) {
            this.dataSource.filteredData[i].items = result
          }
        }

        localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));

      }
    });

  }

  showDetails(){
    const dialogRef = this.dialog.open(AddCustomerDialog, {
      disableClose: true,
      width: '500px',
      data: { id: this.currentCustomer.id,
              name: this.currentCustomer.name,
              lastName: this.currentCustomer.lastName,
              email: this.currentCustomer.email,
              type: this.currentCustomer.type,
              isEditing: true
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {  
        for (let i = 0; i < this.dataSource.filteredData.length; i++) {
          if (this.dataSource.filteredData[i].id == result.id) {
            this.dataSource.filteredData[i].email = result.email
            this.dataSource.filteredData[i].lastName = result.lastName
            this.dataSource.filteredData[i].name = result.name
            this.dataSource.filteredData[i].type = result.type
          }
        }

        localStorage.setItem('customers', JSON.stringify(this.dataSource.filteredData));

      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

@Component({
  selector: 'add-customer-dialog',
  templateUrl: 'add-customer-dialog.html',
  styleUrls: ['./add-customer-dialog.css']
})
export class AddCustomerDialog {

  isInvalidId: boolean = false

  customerForm = new FormGroup({
    customerId: new FormControl('', [
      Validators.required
    ]),
    customerName: new FormControl('', [
      Validators.required
    ]),
    customerLastName: new FormControl('', [
      Validators.required
    ]),
    customerEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    customerType: new FormControl('', [
      Validators.required,
    ]),
  })

  options = [
    {value: '1', viewValue: 'Internal'},
    {value: '2', viewValue: 'External'}
  ];

  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<AddCustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  validateData() {
    var isIdDuplicate = false
    var retrievedObject = localStorage.getItem('customers');
    
    if (retrievedObject) {
      var parseData = JSON.parse(retrievedObject)

      for (let i = 0; i < parseData.length; i++) {
        if (parseData[i].id == this.data.id) {
          isIdDuplicate = true
        }
      }
    }

    if (isIdDuplicate) {
      this.isInvalidId = true
    }
    else {
      this.dialogRef.close(this.data);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}

@Component({
  selector: 'add-item-dialog',
  templateUrl: 'add-item-dialog.html',
  styleUrls: ['./add-item-dialog.css']
})
export class AddItemDialog {

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  motherboardsCtrl = new FormControl();
  filteredMotherboards: Observable<string[]>;
  motherboards: string[] = [];
  allMotherboards: string[] = [ 'MSI A320M-A-PRO MAX',
                          'BIOSTAR A520M H',
                          'ASROCK A520M HVS',
                          'GIGABYTE A520M-H',
                          'MSI B550M PRO',
                          'ASROCK B450M STEEL LEGEND',
                          'GIGABYTE B450 AORUS M',
                          'ASUS TUF GAMING B450M PLUS II',
                          'MSI B560M PRO-VDH',
                        ];

  @ViewChild('motherboardInput') motherboardInput: ElementRef<HTMLInputElement>;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.motherboards.push(value);
    }

    event.chipInput!.clear();

    this.motherboardsCtrl.setValue(null);

  }

  remove(motherboard: string): void {
    const index = this.motherboards.indexOf(motherboard);

    if (index >= 0) {
      this.motherboards.splice(index, 1);
    }

    this.allMotherboards.push(motherboard)
    this.motherboardsCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.motherboards.push(event.option.viewValue);
    this.motherboardInput.nativeElement.value = '';

    this.allMotherboards = this.allMotherboards.filter(obj => obj != event.option.viewValue)
    this.motherboardsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allMotherboards.filter(motherboard => motherboard.toLowerCase().includes(filterValue));
  }

  constructor(
    public dialogRef: MatDialogRef<AddItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogItemData) {
      this.motherboards = Object.assign([], data.items);
      this.filteredMotherboards = this.motherboardsCtrl.valueChanges.pipe(
        startWith(null),
        map((motherboard: string | null) => (motherboard ? this._filter(motherboard) : this.allMotherboards.slice())),
      );

      this.allMotherboards = this.allMotherboards.filter(item => data.items.indexOf(item) < 0);

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}