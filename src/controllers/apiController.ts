import { Controller, Param, Body, Get, Post, QueryParam, Put, Delete } from "routing-controllers";
import UserService from '../services/common/UserService';
import ModuleService from '../services/manage-center/moduleService';
import ElementService from '../services/manage-center/elementService';
import OssService from '../services/aliyun/ossService'
import QrCodeUtils from '../utils/qrCodeUtil';
@Controller()
export class ApiController {
   @Get("/api/getRoleListDic")
   async getRoleListDic(@Body() body: any) {
      try {
         return await UserService.getRoleDic();;
      } catch (err) {
         return err;
      }
   }
   @Get("/api/getFolderTypeDic")
   async getFolderTypeDic(@Body() body: any) {
      try {
         return await ModuleService.getFolderTypeDic();
      } catch (err) {
         return err;
      }
   }

   @Get("/api/getElementTypeDic")
   async getElementTypeDic(@Body() body: any) {
      try {
         return await ElementService.getElementTypeDic();
      } catch (err) {
         return err;
      }
   }

   @Post("/api/getQrCodeImageFromUrl")
   async getQrCodeImageFromUrl(@Body() body: any) {
      try {
         let json = {
            data: QrCodeUtils.getQrCodeImageFromUrl(body.query)
         };
         return json;
      } catch (err) {
         return err;
      }
   }

   @Get("/api/getAliYunOssPolicy")
   async getAliYunOssPolicy(@QueryParam('targetDir') targetDir: string) {
      try {
         return await OssService.getAliYunOssPolicy(targetDir);
      } catch (err) {
         return err;
      }
   }

   @Post("/api/AliYunOssCallback")
   async AliYunOssCallback() {
      try {
         return await OssService.AliYunOssCallback();
      } catch (err) {
         return err;
      }
   }
}