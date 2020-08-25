export type User = {
    username: string;
    password: string;
    userId: string;
    passwordQes: string;
    passwordAns: string;
    userTickName: string;
    createTime: string;
    lastLoginTime: string;
    loginCount: number;
    headSculpture: string;
    status: string;
}
export const  Model = {
    name:'user',
    tableName:'user_list',
    data:{
        username :{
            field:'username',
            required:true,
            default:()=>`''`
        },
        password :{
            field:'password',
            required:true,
            default:()=>`''`
        },
        userId :{
            field:'user_id',
            required:true,
            default:()=>`''`
        },
        passwordQes :{
            field:'password_qes',
            required:true,
            default:()=>`''`
        },
        passwordAns :{
            field:'password_ans',
            required:true,
            default:()=>`''`
        },
        userTickName :{
            field:'user_tick_name',
            required:true,
            default:()=>`''`
        },
        createTime:{
            field:'create_time',
            required:true,
            default:() => ''
        },
        lastLoginTime:{
            field:'last_login_time',
            required:true,
            default:() => ''
        },
        loginCount:{
            field:'login_count',
            required:true,
            default:0
        },
        headSculpture: {
            field:'head_sculpture',
            required:false,
            default: () => `''`
        },
        status:{
            field:'status',
            required:true,
            default:()=>`''`
        }
    }
};
