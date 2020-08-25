export interface IPageParams {
    index: number;
    pageSize: number;
    orderName: string;
    orderType: string;
}
export interface IGetRightListParams extends IPageParams{
    rightName?: string;
    rightId?: string;
}
export interface IGetRoleListParams extends IPageParams{
    roleName?: string;
    roleId?: string;
}
export interface IGetUserListParams extends IPageParams{
    username?: string;
    userId?: string;
    userTickName?: string;
    createTime?: string;
    lastLoginTime?: string;
    roleId?: string;
}
