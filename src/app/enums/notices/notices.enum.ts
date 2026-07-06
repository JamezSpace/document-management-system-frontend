enum NotificationRecipientType {
    ROLE = "role",
    USER = "user"
}

enum NotificationPreference {
    IN_APP = "in app",
    EMAIL = "email"
}

enum NotificationPriority {
    HIGH = 'high',
    LOW = 'low',
    NORMAL = 'normal'
}

enum NotificationState {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    READ = "read"
}

export {NotificationRecipientType, NotificationPreference, NotificationPriority, NotificationState};