import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup | any;
  sortDirection: { [key: string]: string } = { name: 'asc', age: 'asc', dob: 'asc' };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      formRows: this.fb.array([])
    });
    this.addRow();
  }

  get formRows(): FormArray {
    return this.form.get('formRows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      name: ['', Validators.required],
      age: [''],
      cricket: [false],
      dob: ['', Validators.required]
    });

    this.formRows.push(row);
  }

  removeRow(index: number) {
    this.formRows.removeAt(index);
  }

  onSubmit() {
    // Mark all fields as touched to trigger validation messages
    // this.markFormGroupTouched(this.form);
    
    if (this.form.valid) {
      console.log(this.form.value);
      // Handle form submission here
    }
  }

  // markFormGroupTouched(formGroup: FormGroup | any) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof AbstractControl) {
  //       control.markAsTouched({ onlySelf: true });
  //     }
  //   });
  // }

  // Helper method to safely get form control in template
  getControl(formArray: FormArray, index: number, controlName: string): AbstractControl | null {
    const formGroup = formArray.at(index) as FormGroup;
    return formGroup.get(controlName);
  }

  // Sorting method
  sortTable(column: string) {
    const formArray = this.formRows.value;
    const sortDirection = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = sortDirection;

    const sortedArray = formArray.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.form.setControl('formRows', this.fb.array(sortedArray.map((row: any) => this.fb.group(row))));
  }

  get isLastRowValid(): boolean {
    const lastRow = this.formRows.at(this.formRows.length - 1) as FormGroup;
    return lastRow.valid;
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  //when data comes from backend as studentList
  // setStudents(studentList: any[]) {
  //   const studentFormGroups = studentList.map(student => this.fb.group({
  //     name: [student.name, Validators.required],
  //     age: [student.age],
  //     cricket: [student.cricket],
  //     dob: [student.dob, Validators.required]
  //   }));

  //   const formArray = this.fb.array(studentFormGroups);
  //   this.form.setControl('formRows', formArray);
  // }

  getCsv() {
    const rows = this.formRows.value;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Age,Cricket,DOB\n"; // Header row

    rows.forEach((row: any) => {
      const rowArray = [row.name, row.age, row.cricket, row.dob];
      csvContent += rowArray.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "form_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  }
}
