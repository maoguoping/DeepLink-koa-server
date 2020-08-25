export type Project = {
  id: string;
  name: string;
  description: string;  
  createTime: string;
  modifyTime: string;
  path: string;
  pathId: string;
  tag: string;
  children: string;
}
export const Model = {
  name:'project',
  tableName:'project_list',
  data:{
    id :{
      field:'project_id',
      required:true,
      default:()=>`''`
    },
    name :{
      field:'project_name',
      required:true,
      default:()=>`''`
    },
    description :{
      field:'project_description',
      required:false,
      default:()=>`''`
    },
    createTime:{
      field:'create_time',
      required:true,
      default: () => 0
    },
    modifyTime:{
      field:'modify_time',
      required:true,
      default: () => 0
    },
    path:{
      field:'path',
      required:true,
      default:()=>`''`
    },
    pathId:{
      field:'path_id',
      required:true,
      default:()=>`''`
    },
    tag:{
        field:'tag',
        required:true,
        default:()=>`''`
    },
    children:{
      field:'children',
      required:false,
      default:()=>`'${JSON.stringify([])}'`
    },
  },
  staticData:{
    type :{
      required:true,
      value:'project',
      default:()=>'project'
    },
    typeId :{
      required:true,
      value:0,
      default:()=>0
    }
  }
};
