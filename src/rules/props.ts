export type RuleItem = {
  type: string;
  required: boolean;
  allowEmpty: boolean;
  max?: number;
  min?: number;
  trim?: boolean;
}
export type EnumRuleItem = string[]
export type Rule = Record<string, RuleItem | EnumRuleItem>
// common
const description200: RuleItem = {type: 'string', required: true, allowEmpty: true, max: 200}
const pathId: RuleItem = {type: 'string', required: true, allowEmpty: false}
const pathIdWithEmpty: RuleItem = {type: 'string', required: true, allowEmpty: true}
const path: RuleItem = {type: 'string', required: true, allowEmpty: true}
// user
const username: RuleItem = {type: 'string', required: true, allowEmpty: false}
const password: RuleItem = {type: 'string', required: true, allowEmpty: false}
const userId: RuleItem = {type: 'string', required: true, allowEmpty: false, max: 32, min: 32, trim: true}
// right
const rightId: RuleItem = {type: 'string', required: true, allowEmpty: false, max: 32, min: 32, trim: true}
const rightName: RuleItem = {type: 'string', required: true, allowEmpty: false}
// role
const roleId: RuleItem = {type: 'string', required: true, allowEmpty: false}
const roleName: RuleItem = {type: 'string', required: true, allowEmpty: false}
// project
const projectId: RuleItem = {type: 'string', required: true, allowEmpty: false}
const projectName: RuleItem = {type: 'string', required: true, allowEmpty: false}
// module
const moduleId: RuleItem = {type: 'string', required: true, allowEmpty: false}
const moduleName: RuleItem = {type: 'string', required: true, allowEmpty: false}
export const userInfoRule: Rule = {
  userId: userId,
  username: username,
  userTickName: {type: 'string', required: false, allowEmpty: true},
  roleId: roleId
}
export const roleInfoRule: Rule = {
  roleName: roleName,
  roleId: roleId,
  description: description200
}
export const rightChangeInfo: Rule = {
  rightId: rightId,
  addRoleIds: {type: 'string', required: true, allowEmpty: false},
  deleteRoleIds: {type: 'string', required: true, allowEmpty: false}
}
export const rightInfoRule: Rule = {
  rightId: rightId
}
export const updateRightInfoRule: Rule = {
  rightId: rightId,
  rightName: rightName,
  path: {type: 'string', required: true, allowEmpty: false},
  description: description200
}
export const loginInfoRule: Rule = {
  username: username,
  password: password
}
export const registerInfoRule: Rule = {
  username: username,
  password: password,
  passwordQes: {type: 'string', required: true, allowEmpty: false},
  passwordAns: {type: 'string', required: true, allowEmpty: false}
}
export const pageAcceessListRule: Rule = {
  userId: userId
}
export const getViewDataByPathIdRule: Rule = {
  pathId: pathIdWithEmpty,
  currentPage : {type: 'number', required: true, min: 1, allowEmpty: false},
  pageSize: {type: 'number', required: true, min: 1, allowEmpty: false},
  order: ['ASC', 'DESC'],
  sortBy: {type: 'string', required: true, allowEmpty: false}
}
export const addProjectRule: Rule = {
  name: projectName,
  description: description200
}
export const updateProjectRule : Rule = {
  name: projectName,
  oldName: projectName,
  id: projectId,
  description: description200
}
export const deleteProjectRule : Rule = {
  id: projectId
}
export const addModuleRule: Rule = {
  name: moduleName,
  description: description200,
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true, allowEmpty: false},
  parentId: moduleId,
  parentName: moduleName,
  parentPath: path,
  parentPathId: pathId,
  parentType: {type: 'number', required: true, allowEmpty: false},
  parentTypeId: {type: 'string', required: true, allowEmpty: false}
}
export const updateModuleRule: Rule = {
  name: moduleName,
  oldName: moduleName,
  description: description200,
  moduleType: ['0', '1'],
  typeId: {type: 'number', required: true, allowEmpty: false},
  id: moduleId
}
export const deleteModuleRule: Rule = {
  id: moduleId
}
export const getInfoByPathIdRule: Rule = {
  pathId: pathIdWithEmpty
}
