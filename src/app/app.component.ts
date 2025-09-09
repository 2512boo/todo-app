import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone :false
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    if (!this.newTodo.trim()) return;
    const todo: Partial<Todo> = { title: this.newTodo, done: false };
    this.todoService.addTodo(todo).subscribe(() => {
      this.newTodo = '';
      this.loadTodos();
    });
  }

  toggleTodo(todo: Todo) {
    this.todoService
      .updateTodo(todo.id, { done: !todo.done })
      .subscribe(() => this.loadTodos());
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.loadTodos();
    });
  }
}

