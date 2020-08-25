export type ElementType = {
  id: string;
  name: string;
}
export const  Model = {
  name:'elementType',
  tableName:'element_type_dic',
  data:{
    id :{
      field:'element_type_id',
      required:true,
      default:()=>`''`
    },
    name :{
      field:'element_type_name',
      required:true,
      default:()=>`''`
    }
  }
};
