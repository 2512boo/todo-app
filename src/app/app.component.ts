import { Component, signal, computed } from '@angular/core';
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

  showAddModal = signal(false);
  showEditModal = signal(false);
  newText = '';
  editText = '';
  editId: number | null = null;

  filter = signal<'all' | 'active' | 'done'>('all');

  private persist() {
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  get filteredTodos() {
    return computed(() => {
      switch (this.filter()) {
        case 'active': return this.todos().filter(t => !t.done);
        case 'done': return this.todos().filter(t => t.done);
        default: return this.todos();
      }
    })();
  }

  // --- Add todo ---
  openAddModal() {
    this.newText = '';
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  addTodo() {
    const text = this.newText.trim();
    if (!text) return;
    const todo: Todo = { id: Date.now(), text, done: false };
    this.todos.update(list => [...list, todo]);
    this.persist();
    this.closeAddModal();
  }

  // --- Edit todo ---
  openEditModal(todo: Todo) {
    this.editId = todo.id;
    this.editText = todo.text;
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editId = null;
    this.editText = '';
  }

  saveEdit() {
    if (!this.editText.trim() || this.editId === null) return;
    this.todos.update(list =>
      list.map(t => (t.id === this.editId ? { ...t, text: this.editText } : t))
    );
    this.persist();
    this.closeEditModal();
  }

  // --- Toggle & Delete ---
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

  // --- Filter ---
  setFilter(f: 'all' | 'active' | 'done') {
    this.filter.set(f);
  }
}
