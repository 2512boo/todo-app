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
  todos = signal<Todo[]>(JSON.parse(localStorage.getItem('todos') || '[]'));
  showModal = signal(false); // ✅ popup hiển thị hay không
  newText = '';

  private persist() {
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  openModal() {
    this.newText = '';
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  addTodo() {
    const text = this.newText.trim();
    if (!text) return;
    const todo: Todo = { id: Date.now(), text, done: false };
    this.todos.update(list => [...list, todo]);
    this.persist();
    this.closeModal();
  }

  toggle(todo: Todo) {
    this.todos.update(list =>
      list.map(t => (t.id === todo.id ? { ...t, done: !t.done } : t))
    );
    this.persist();
  }

  remove(id: number) {
    this.todos.update(list => list.filter(t => t.id !== id));
    this.persist();
  }
}
