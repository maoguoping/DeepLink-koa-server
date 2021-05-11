export type WxUserRelation = {
    relationId: string;
    userId: string;
    openId: string;
  }
  export const Model = {
    name:'wxUserRelation',
    tableName:'wx_user_relation',
    data:{
      relationId :{
        field:'id',
        required:true,
        default:()=>`''`
      },
      userId :{
        field:'user_id',
        required:true,
        default:()=>`''`
      },
      openId :{
        field:'wx_open_id',
        required:true,
        default:()=>`''`
      }
    }
  };
  