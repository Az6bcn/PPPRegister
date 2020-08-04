export interface ResetPassword{
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
}