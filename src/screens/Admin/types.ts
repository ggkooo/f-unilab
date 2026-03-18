export interface UserFormState {
    name: string;
    login: string;
    password: string;
    active: boolean;
    is_admin: boolean;
}

export interface RegisterUserFormState {
    name: string;
    login: string;
    password: string;
    passwordConfirmation: string;
}

export interface ConfirmDialogConfig {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => Promise<void>;
}

export const emptyUserForm: UserFormState = {
    name: '',
    login: '',
    password: '',
    active: true,
    is_admin: false,
};

export const emptyRegisterUserForm: RegisterUserFormState = {
    name: '',
    login: '',
    password: '',
    passwordConfirmation: '',
};
