export type Module = {
  id: string;
  name: string;
  moduleType: number;
  typeId: string;
  tag: string;
  description: string;
  createTime: string;
  modifyTime: string;
  path: string;
  pathId: string;
  parentId: string;
  parentName: string;
  parentTypeId: string;
  parentPath: string;
  parentPathId: string;
  children: string;
}
export const  Model = {
  name:'module',
  tableName:'module_list',
  data:{
    id :{
      field:'module_id',
      required:true,
      default:()=>`''`
    },
    moduleName :{
      field:'module_name',
      required:true,
      default:()=>`''`
    },
    moduleType:{
      field:'module_type',
      required:true,
      default:()=> 0
    },
    typeId:{
      field:'module_type_id',
      required:true,
      default:()=>`''`
    },
    tag:{
      field:'tag',
      required:true,
      default:()=>`''`
    },
    description :{
      field:'module_description',
      required:false,
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
    parentId:{
      field:'parent_id',
      required:true,
      default:()=>`''`
    },
    parentName:{
      field:'parent_name',
      required:true,
      default:()=>`''`
    },
    parentTypeId:{
      field:'parent_type_id',
      required:true,
      default:()=>`''`
    },
    parentPath:{
      field:'parent_path',
      required:true,
      default:()=>`''`
    },
    parentPathId:{
      field:'parent_path_id',
      required:true,
      default:()=>`''`
    },
    children:{
      field:'children',
      required:false,
      default:()=>`'${JSON.stringify([])}'`
    }
  }
};