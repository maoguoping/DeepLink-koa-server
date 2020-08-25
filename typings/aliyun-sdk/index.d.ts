declare namespace RAM {
    interface Options {
        accessKeyId: string;
        AccessKeysecret: string;
        endpoint: string;
        apiVersion: string;
        [propName: string]: any;
    }
    interface CreateUserOptions {
        Action: string;
        UserName: string;
        DisplayName?: string;
        MobilePhone?: string;
        Email?: string;
        Comments?: string;
    }

    interface GetUserOptions {
        Action: string;
        UserName: string;
    }

    interface UpdateUserOptions {
        Action: string;
        UserName: string;
        NewUserName?: string;
        NewMobilePhone?: string;
        NewDisplayName?: string;
        NewEmail?: string;
        NewComments?: string;
    }

    interface DeleteUserOptions {
        Action: string;
        UserName: string;
    }

    interface ListUsers {
        Action: string;
        Marker?: string;
        MaxItems?: number;
    }
}
declare namespace ALY  {
    interface Callback {
        (err: any, data: any): void
    }
    class OSS {
        constructor(options: any);
        putObject(options: any, callback: Callback): void
        deleteObject(options: any, callback: Callback): void
    }
    class RAM {
        constructor(options: RAM.Options)

        public createUser(options: RAM.CreateUserOptions, callback: Callback): void

        public getUser(options: RAM.GetUserOptions, callback: Callback): void

        public updateUser(options: RAM.UpdateUserOptions, callback: Callback): void

        public deleteUser(options: RAM.DeleteUserOptions, callback: Callback): void

        public listUser(options: RAM.ListUsers, callback: Callback): void

        
    } 
}
declare module 'aliyun-sdk' {
    export = ALY
}
