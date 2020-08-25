export type Role = {
    roleId: string;
    parentRoleId: string;
    roleName: string;
    createTime: string;
    description: string;
}
export const Model = {
    name:'role',
    tableName:'role_list',
    data:{
        roleId :{
            field:'role_id',
            required:true,
            default:()=>`''`
        },
        parentRoleId :{
            field:'parent_role_id',
            required:true,
            default:()=>`''`
        },
        roleName :{
            field:'role_name',
            required:true,
            default:()=>`''`
        },
        createTime:{
            field:'create_time',
            required:true,
            default:() => ''
        },
        description:{
            field:'description',
            required:false,
            default:()=>`''`
        }
    }
};
