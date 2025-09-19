import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos: Todo[] = [];
  newTodo: string = '';
  showPopup: boolean = false;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.newTodo = '';
  }

  addTodo() {
    if (this.newTodo.trim()) {
      const todo: Partial<Todo> = { title: this.newTodo, done: false };
      this.todoService.addTodo(todo).subscribe(() => {
        this.loadTodos();
        this.closePopup();
      });
    }
  }

  toggleTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, { done: !todo.done }).subscribe(() => {
      this.loadTodos();
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }
}
