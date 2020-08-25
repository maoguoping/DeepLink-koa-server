export type RoleRightRelation = {
  relationId: string;
  roleId: string;
  rightId: string;
  rightType: string;
}
export const Model = {
  name:'roleRightRelation',
  tableName:'role_right_relation',
  data:{
    relationId :{
      field:'relation_id',
      required:true,
      default:()=>`''`
    },
    roleId :{
      field:'role_id',
      required:true,
      default:()=> 11
    },
    rightId :{
      field:'right_id',
      required:true,
      default:()=>`''`
    },
    rightType :{
      field:'right_type',
      required:true,
      default:()=> 0
    }
  }
};
