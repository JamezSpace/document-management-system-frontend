import { computed, Injectable, Signal, signal } from '@angular/core';
import { Delta, Op } from 'quill';

export interface WorkspacePendingChange {
  key: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceUiService {
  private readonly changes = signal<Record<string, string>>({});
  private savedContentFingerprint = '';
  private savedAdditionalAddresseeIds: string[] = [];
  private readonly additionalAddresseeIds = signal<string[]>([]);
  private quillEditorContent = signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }>({
    deltaContent: null,
    textContent: '',
    htmlContent: '',
  });

  readonly pendingChanges = computed<WorkspacePendingChange[]>(() =>
    Object.entries(this.changes()).map(([key, description]) => ({ key, description })),
  );
  readonly hasUnsavedChanges = computed(() => this.pendingChanges().length > 0);
  private readonly isDocumentSaved = computed(() => !this.hasUnsavedChanges());
  readonly selectedAdditionalAddresseeIds = this.additionalAddresseeIds.asReadonly();

  setIsDocumentSaved(value: boolean) {
    this.setChange('content', value ? null : 'Document content was edited.');
  }

  getIsDocumentSaved(): Signal<boolean> {
    return this.isDocumentSaved;
  }

  resetWorkspaceState() {
    this.changes.set({});
    this.savedContentFingerprint = '';
    this.savedAdditionalAddresseeIds = [];
    this.additionalAddresseeIds.set([]);
    this.quillEditorContent.set({ deltaContent: null, textContent: '', htmlContent: '' });
  }

  resetQuillEditorContent() {
    this.resetWorkspaceState();
  }

  initializeQuillEditorContent(data: { delta: unknown; html?: unknown; text?: unknown }) {
    const content = this.toEditorContent(data);
    this.quillEditorContent.set(content);
    this.savedContentFingerprint = this.contentFingerprint(content.deltaContent);
    this.setChange('content', null);
  }

  updateQuillEditorContent(data: { delta: unknown; html?: unknown; text?: unknown }) {
    const content = this.toEditorContent(data);
    this.quillEditorContent.set(content);

    const changed = this.contentFingerprint(content.deltaContent) !== this.savedContentFingerprint;
    this.setChange('content', changed ? 'Document content was edited.' : null);
  }

  setQuillEditorContent(data: { delta: unknown; html?: unknown; text?: unknown }) {
    this.updateQuillEditorContent(data);
  }

  initializeAdditionalAddressees(ids: string[]) {
    const normalized = this.normalizeIds(ids);
    this.savedAdditionalAddresseeIds = normalized;
    this.additionalAddresseeIds.set(normalized);
    this.setChange('additional-addressees', null);
  }

  updateAdditionalAddressees(ids: string[], description: string) {
    const normalized = this.normalizeIds(ids);
    this.additionalAddresseeIds.set(normalized);

    const changed = !this.sameIds(normalized, this.savedAdditionalAddresseeIds);
    this.setChange('additional-addressees', changed ? description : null);
  }

  commitChanges() {
    this.commitSavedState(
      this.quillEditorContent().deltaContent,
      this.additionalAddresseeIds(),
    );
  }

  commitSavedState(contentDelta: unknown, additionalAddresseeIds: string[]) {
    this.savedContentFingerprint = this.rawContentFingerprint(contentDelta);
    this.savedAdditionalAddresseeIds = this.normalizeIds(additionalAddresseeIds);

    const contentChanged = this.contentFingerprint(this.quillEditorContent().deltaContent)
      !== this.savedContentFingerprint;
    const addresseesChanged = !this.sameIds(
      this.additionalAddresseeIds(),
      this.savedAdditionalAddresseeIds,
    );

    this.changes.update((current) => {
      const next = { ...current };
      if (contentChanged) next['content'] ??= 'Document content was edited.';
      else delete next['content'];
      if (!addresseesChanged) delete next['additional-addressees'];
      return next;
    });
  }

  private toEditorContent(data: { delta: unknown; html?: unknown; text?: unknown }) {
    return {
      deltaContent: new Delta(data.delta as { ops: Op[] }),
      htmlContent: (data.html as string | undefined) ?? '',
      textContent: (data.text as string | undefined) ?? '',
    };
  }

  private contentFingerprint(delta: Delta | null): string {
    return JSON.stringify(delta?.ops ?? []);
  }

  private rawContentFingerprint(delta: unknown): string {
    if (delta instanceof Delta) return this.contentFingerprint(delta);
    const value = delta as { ops?: Op[] } | null | undefined;
    return JSON.stringify(value?.ops ?? []);
  }

  private normalizeIds(ids: string[]): string[] {
    return [...new Set(ids.filter(Boolean))];
  }

  private sameIds(left: string[], right: string[]): boolean {
    if (left.length !== right.length) return false;
    const rightIds = new Set(right);
    return left.every((id) => rightIds.has(id));
  }

  private setChange(key: string, description: string | null) {
    this.changes.update((current) => {
      const next = { ...current };
      if (description) next[key] = description;
      else delete next[key];
      return next;
    });
  }

  getQuillEditorContent(): Signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }> {
    return this.quillEditorContent.asReadonly();
  }
}
