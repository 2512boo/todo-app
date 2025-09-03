import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Todo List';
  newText = '';
  private nextId = 1;

  todos = signal<Todo[]>([
    { id: this.nextId++, text: 'Học Angular', done: false },
    { id: this.nextId++, text: 'Viết Todo App', done: true },
  ]);

  add() {
    const text = this.newText.trim();
    if (!text) return;
    this.todos.update(list => [...list, { id: this.nextId++, text, done: false }]);
    this.newText = '';
  }

  toggle(todo: Todo) {
    this.todos.update(list =>
      list.map(t => (t.id === todo.id ? { ...t, done: !t.done } : t))
    );
  }

  remove(id: number) {
    this.todos.update(list => list.filter(t => t.id !== id));
  }

  clearCompleted() {
    this.todos.update(list => list.filter(t => !t.done));
  }

  get remainingCount() {
    return this.todos().filter(t => !t.done).length;
  }
}
