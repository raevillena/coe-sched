export interface User {
    id: number;
    name: string;
    email: string;
    department_id: number;
    email_verified_at?: string;
    role: "super-admin" | "admin" | "user";
    profile_picture: string;
    theme: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        department_id: any;
        user: User;
    };
    userDepartmentId: number;
};
