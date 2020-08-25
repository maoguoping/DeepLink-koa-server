export type FolderType = {
  id: string;
  name: string;
}
export const  Model = {
  name:'folderType',
  tableName:'folder_type_dic',
  data:{
    id :{
      field:'folder_type_id',
      required:true,
      default:()=>`''`
    },
    name :{
      field:'folder_type_name',
      required:true,
      default:()=>`''`
    }
  }
};
