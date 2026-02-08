import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  protected registercreds: any = {};
  private http = inject(HttpClient);
  onRegister() {
    debugger;
    console.log(this.registercreds);
    this.http.post('http://localhost:5000/api/', 'Auth/register', this.registercreds);
  }
}
