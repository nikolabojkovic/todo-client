import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {
  importDisabled: boolean = true;
  exportDisabled: boolean = false;
  buttonStyle : any = { 
    backgroundColor: '#F5F6F7', 
    borderRadius: '20px', 
    minWidth: '90px'
  }

  constructor() { }

  ngOnInit(): void { }
}
