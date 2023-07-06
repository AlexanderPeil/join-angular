import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskMenuComponent } from '../add-task-menu/add-task-menu.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  animal: any;

  constructor(public dialog: MatDialog) { }

  openAddTask(): void {
    let dialogRef = this.dialog.open(AddTaskMenuComponent, {
      height: '700px',
      width: '1100px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log('The dialog was closed');
      this.animal = result;
      
    });
  }

}
