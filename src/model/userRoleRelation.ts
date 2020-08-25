export type UserRoleRelation = {
  relationId: string;
  userId: string;
  roleId: string;
}
export const Model = {
  name:'userRoleRelation',
  tableName:'user_role_relation',
  data:{
    relationId :{
      field:'relation_id',
      required:true,
      default:()=>`''`
    },
    userId :{
      field:'user_id',
      required:true,
      default:()=>`''`
    },
    roleId :{
      field:'role_id',
      required:true,
      default:()=>`''`
    }
  }
};
