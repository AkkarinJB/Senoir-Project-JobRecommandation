import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-skill-chip-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-chip-select.component.html'
})
export class SkillChipSelectComponent implements OnInit {
  private skillService = inject(SkillService);

  @Input() selected: Skill[] = [];
  @Output() selectedChange = new EventEmitter<Skill[]>();
  @Input() placeholder = 'พิมพ์ชื่อทักษะเพื่อค้นหาหรือเพิ่มใหม่...';

  allSkills = signal<Skill[]>([]);
  isOpen = signal(false);
  query = '';

  filteredSuggestions(): Skill[] {
    const term = this.query.trim().toLowerCase();
    const selectedIds = new Set(this.selected.map((s) => s.id));
    let pool = this.allSkills().filter((s) => !selectedIds.has(s.id));
    if (term) {
      pool = pool.filter((s) => s.name.toLowerCase().includes(term));
    }
    return pool.slice(0, 20);
  }

  showAddNew(): boolean {
    const term = this.query.trim();
    if (!term) return false;
    const exists = this.allSkills().some((s) => s.name.toLowerCase() === term.toLowerCase());
    return !exists;
  }

  ngOnInit() {
    this.skillService.getSkills().subscribe({
      next: (skills) => this.allSkills.set(skills),
      error: () => {}
    });
  }

  onEnter(event: Event) {
    event.preventDefault();
    const term = this.query.trim();
    if (!term) return;

    const exactMatch = this.allSkills().find((s) => s.name.toLowerCase() === term.toLowerCase());
    if (exactMatch) {
      this.add(exactMatch);
    } else {
      this.addNew();
    }
  }

  add(skill: Skill) {
    if (this.selected.some((s) => s.id === skill.id)) return;
    this.selectedChange.emit([...this.selected, skill]);
    this.query = '';
    this.isOpen.set(false);
  }

  addNew() {
    const name = this.query.trim();
    if (!name) return;

    this.skillService.createSkill(name).subscribe({
      next: (skill) => {
        this.allSkills.set([...this.allSkills(), skill]);
        this.add(skill);
      }
    });
  }

  remove(skill: Skill) {
    this.selectedChange.emit(this.selected.filter((s) => s.id !== skill.id));
  }
}
