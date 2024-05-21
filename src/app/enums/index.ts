export enum BloodGroup {
    'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-', 'A+', 'A-'
}

enum USER_RULES {
    "ADMIN",
    "PATIENT",
    "DOCTOR"
}

enum APPT_STATUS {
    "Pending",
    "Done",
    "Canceled",
    "Started"
}
 enum AREA {
    "Iraq",
}
 enum AuthUser {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    PATIENT = 'patient',
    SUPER_ADMIN = 'super_admin'
}
const enums = {
    BloodGroup,
    USER_RULES,
    APPT_STATUS,
    AREA,
    AuthUser
  };
export default enums;