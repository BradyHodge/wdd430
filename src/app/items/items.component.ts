import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Item } from '../models/item';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-items',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);

  readonly items = signal<Item[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    done: [false],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'Could not load items. Start the API (npm run api) and MongoDB, or use ng serve with the proxy after the API is up.',
        );
        this.loading.set(false);
      },
    });
  }

  startEdit(item: Item): void {
    this.editingId.set(item._id);
    this.form.patchValue({
      title: item.title,
      description: item.description,
      done: item.done,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '', done: false });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    const id = this.editingId();
    this.loading.set(true);
    this.error.set(null);
    if (id) {
      this.itemService.update(id, value).subscribe({
        next: () => {
          this.cancelEdit();
          this.load();
        },
        error: () => {
          this.error.set('Update failed');
          this.loading.set(false);
        },
      });
    } else {
      this.itemService.create(value).subscribe({
        next: () => {
          this.cancelEdit();
          this.load();
        },
        error: () => {
          this.error.set('Create failed');
          this.loading.set(false);
        },
      });
    }
  }

  remove(id: string): void {
    if (!globalThis.confirm('Delete this item?')) {
      return;
    }
    this.itemService.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Delete failed'),
    });
  }
}
