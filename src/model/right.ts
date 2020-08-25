export type Right = {
    rightId: string;
    parentRightId: string;
    rightName: string;
    createTime: string;
    modifyTime: string;
    description: string;
}
export const Model = {
    name:'right',
    tableName:'right_list',
    data:{
        rightId :{
            field:'right_id',
            required:true,
            default:()=>`''`
        },
        parentRightId :{
            field:'parent_right_id',
            required:true,
            default:()=>`''`
        },
        rightName :{
            field:'right_name',
            required:true,
            default:()=>`''`
        },
        createTime:{
            field:'create_time',
            required:true,
            default: () => ''
        },
        modifyTime:{
            field:'modify_time',
            required:true,
            default: () => ''
        },
        description:{
            field:'description',
            required:false,
            default:()=>`''`
        }
    }
};
