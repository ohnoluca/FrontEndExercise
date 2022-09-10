import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public users? : User[]; //before was users: User[] = [];
  public editUser? : User;
  public deleteUser? : User;

  constructor(private userService: UserService){}

  ngOnInit() { //everytime this component is initialized, it will run getUsers method
    this.getUsers();
  }

  public getUsers(): void{
    this.userService.getUsers().subscribe(
      (response : User[]) => {
        this.users = response;
        console.log(this.users);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onCreateUser(input : string): void {
    //var inputValue = (<HTMLInputElement>document.getElementById('numUsers')).value;
    
    var userNum = parseInt(input);
    for(let i = 0; i < userNum; i++){
      this.userService.createUser().subscribe(
        (response: User) => {
          console.log(response);
          this.userService.addUser(response).subscribe();
          this.getUsers();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        },
      );
    }
    
  }

  public onAddUser(addForm : NgForm): void {
    document.getElementById('add-employee-form')?.click(); //making sure to close the modal whenever I add a user
    this.userService.addUser(addForm.value).subscribe( //addUsers is the service making calls to the backend, so we need to subscribe to it to wait for response
      (response: User) => {
        console.log(response);
        this.getUsers();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    ); 
  }

  public onUpdateUser(user : User): void {
    this.userService.updateUser(user).subscribe( //addUsers is the service making calls to the backend, so we need to subscribe to it to wait for response
      (response: User) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    ); 
  }

  public onDeleteUser(userId : number): void {
    this.userService.deleteUser(userId).subscribe( //addUsers is the service making calls to the backend, so we need to subscribe to it to wait for response
      (response: void) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    ); 
  }

  public onAddModal(): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addUserModal');

    container?.appendChild(button);
    button.click();
  }

  public onOpenModal(user : User, mode : string): void {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'edit') {
      this.editUser = user;
      button.setAttribute('data-target', '#updateUserModal');
    }

    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }

    container?.appendChild(button);
    button.click();

  }

}
