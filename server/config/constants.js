module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin'
  },
  EMPLOYMENT_STATUS: {
    CURRENTLY_SERVING: 'Currently Serving',
    RESIGNED: 'Resigned',
    RETIRED: 'Retired'
  },
  TRAINING_TYPES: {
    OT: 'OT',
    ILT: 'ILT',
    BLENDED: 'Blended',
    EXTERNAL: 'Training for external members',
    GROUP: 'Group specific',
    OTHERS: 'Others',
    NONE: '-'
  },
  TRAINING_MODES: {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    HYBRID: 'Hybrid',
    OTHERS: 'Others',
    NONE: '-'
  },
  TRAINING_STATUSES: {
    COMPLETED: 'Completed',
    NOT_COMPLETED: 'Not Completed',
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In Progress',
    CANCELLED: 'Cancelled',
    NONE: '-'
  },
  MASTER_DATA_TYPES: {
    DESIGNATION: 'designation',
    GROUP_NAME: 'groupName',
    PRODUCT_DIVISION: 'productDivision',
    DEPARTMENT: 'department',
    TYPE_OF_TRAINING: 'typeOfTraining'
  },
  AUDIT_ACTIONS: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    EXPORT: 'EXPORT',
    BULK_UPLOAD: 'BULK_UPLOAD'
  }
};
