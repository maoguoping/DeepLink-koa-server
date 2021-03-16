export const userInfoRule = {
  userId: {type: 'string', required: true, allowEmpty: false},
  username: {type: 'string', required: true, allowEmpty: false},
  userTickName: {type: 'string', required: false, allowEmpty: true},
  roleId: {type: 'string', required: true, allowEmpty: false}
}
export const roleInfoRule = {
  roleName: {type: 'string', required: true, allowEmpty: false},
  roleId: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200}
}
export const rightChangeInfo = {
  rightId: {type: 'string', required: true, allowEmpty: true},
  addRoleIds: {type: 'string', required: true, allowEmpty: false},
  deleteRoleIds: {type: 'string', required: true, allowEmpty: false}
}
export const rightInfoRule = {
  rightId: {type: 'string', required: true, allowEmpty: false}
}
export const updateRightInfoRule = {
  rightId: {type: 'string', required: true, allowEmpty: false},
  rightName: {type: 'string', required: true, allowEmpty: false},
  path: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200}
}
export const loginInfoRule = {
  username: {type: 'string', required: true, allowEmpty: false},
  password: {type: 'string', required: true, allowEmpty: false}
}
export const registerInfoRule = {
  username: {type: 'string', required: true, allowEmpty: false},
  password: {type: 'string', required: true, allowEmpty: false},
  passwordQes: {type: 'string', required: true, allowEmpty: false},
  passwordAns: {type: 'string', required: true, allowEmpty: false}
}
export const pageAcceessListRule = {
  userId: {type: 'string', required: true, allowEmpty: false}
}
export const getViewDataByPathIdRule = {
  pathId: {type: 'string', required: true, allowEmpty: true},
  currentPage : {type: 'number', required: true, min: 1},
  pageSize: {type: 'number', required: true, min: 1},
  order: ['ASC', 'DESC'],
  sortBy: {type: 'string', required: true, allowEmpty: false}
}
export const addProjectRule= {
  name: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200}
}
export const updateProjectRule= {
  name: {type: 'string', required: true, allowEmpty: false},
  oldName: {type: 'string', required: true, allowEmpty: false},
  id: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200}
}
export const deleteProjectRule= {
  id: {type: 'string', required: true, allowEmpty: false}
}
export const addModuleRule = {
  name: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200},
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true},
  parentId: {type: 'string', required: true, allowEmpty: false},
  parentName: {type: 'string', required: true, allowEmpty: false},
  parentPath: {type: 'string', required: true, allowEmpty: false},
  parentPathId: {type: 'string', required: true, allowEmpty: false},
  parentType: {type: 'number', required: true},
  parentTypeId: {type: 'string', required: true, allowEmpty: false}
}
export const updateModuleRule = {
  name: {type: 'string', required: true, allowEmpty: false},
  oldName: {type: 'string', required: true, allowEmpty: false},
  description: {type: 'string', required: true, allowEmpty: true, max: 200},
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true},
  id: {type: 'string', required: true, allowEmpty: false}
}
export const deleteModuleRule= {
  id: {type: 'string', required: true, allowEmpty: false}
}
export const getInfoByPathIdRule= {
  pathId: {type: 'string', required: true, allowEmpty: true},
  path: {type: 'string', required: true, allowEmpty: true}
}
