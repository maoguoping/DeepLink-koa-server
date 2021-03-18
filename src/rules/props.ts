// common
const description200 = {type: 'string', required: true, allowEmpty: true, max: 200}
const pathId = {type: 'string', required: true, allowEmpty: false}
const pathIdWithEmpty = {type: 'string', required: true, allowEmpty: true}
const path = {type: 'string', required: true, allowEmpty: true}
// user
const username = {type: 'string', required: true, allowEmpty: false}
const password = {type: 'string', required: true, allowEmpty: false}
const userId = {type: 'string', required: true, allowEmpty: false, max: 32, min: 32, trim: true}
// right
const rightId = {type: 'string', required: true, allowEmpty: false, max: 32, min: 32, trim: true}
const rightName = {type: 'string', required: true, allowEmpty: false}
// role
const roleId = {type: 'string', required: true, allowEmpty: false}
const roleName = {type: 'string', required: true, allowEmpty: false}
// project
const projectId = {type: 'string', required: true, allowEmpty: false}
const projectName = {type: 'string', required: true, allowEmpty: false}
// module
const moduleId = {type: 'string', required: true, allowEmpty: false}
const moduleName = {type: 'string', required: true, allowEmpty: false}
export const userInfoRule = {
  userId: userId,
  username: username,
  userTickName: {type: 'string', required: false, allowEmpty: true},
  roleId: roleId
}
export const roleInfoRule = {
  roleName: roleName,
  roleId: roleId,
  description: description200
}
export const rightChangeInfo = {
  rightId: rightId,
  addRoleIds: {type: 'string', required: true, allowEmpty: false},
  deleteRoleIds: {type: 'string', required: true, allowEmpty: false}
}
export const rightInfoRule = {
  rightId: rightId
}
export const updateRightInfoRule = {
  rightId: rightId,
  rightName: rightName,
  path: {type: 'string', required: true, allowEmpty: false},
  description: description200
}
export const loginInfoRule = {
  username: username,
  password: password
}
export const registerInfoRule = {
  username: username,
  password: password,
  passwordQes: {type: 'string', required: true, allowEmpty: false},
  passwordAns: {type: 'string', required: true, allowEmpty: false}
}
export const pageAcceessListRule = {
  userId: userId
}
export const getViewDataByPathIdRule = {
  pathId: pathIdWithEmpty,
  currentPage : {type: 'number', required: true, min: 1},
  pageSize: {type: 'number', required: true, min: 1},
  order: ['ASC', 'DESC'],
  sortBy: {type: 'string', required: true, allowEmpty: false}
}
export const addProjectRule= {
  name: projectName,
  description: description200
}
export const updateProjectRule= {
  name: projectName,
  oldName: projectName,
  id: projectId,
  description: description200
}
export const deleteProjectRule= {
  id: projectId
}
export const addModuleRule = {
  name: moduleName,
  description: description200,
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true},
  parentId: moduleId,
  parentName: moduleName,
  parentPath: path,
  parentPathId: pathId,
  parentType: {type: 'number', required: true},
  parentTypeId: {type: 'string', required: true, allowEmpty: false}
}
export const updateModuleRule = {
  name: moduleName,
  oldName: moduleName,
  description: description200,
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true},
  id: moduleId
}
export const deleteModuleRule= {
  id: moduleId
}
export const getInfoByPathIdRule= {
  pathId: pathIdWithEmpty,
  path: path
}
