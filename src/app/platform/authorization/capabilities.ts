export const Capabilities = {
  Document: {
    View: 'document.view',
    Create: 'document.create',
    Update: 'document.update',
    Submit: 'document.submit',
    Approve: 'document.approve',
    Sign: 'document.sign',
  },
  Record: {
    View: 'record.view',
    Register: 'record.register',
    Classify: 'record.classify',
    Route: 'record.route',
    Archive: 'record.archive',
    Dispose: 'record.dispose',
  },
  Workflow: {
    View: 'workflow.view',
    Assign: 'workflow.assign',
    Forward: 'workflow.forward',
    Return: 'workflow.return',
    Escalate: 'workflow.escalate',
  },
  Directive: {
    View: 'directive.view',
    Issue: 'directive.issue',
  },
  Staff: {
    View: 'staff.view',
    Create: 'staff.create',
    Update: 'staff.update',
    Activate: 'staff.activate',
  },
  Notice: {
    View: 'notice.view',
  },
  Audit: {
    View: 'audit.view',
  },
  System: {
    Configure: 'system.configure',
  },
} as const;

