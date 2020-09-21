import config from '../../../config'
import sqlLink from '../../model';
import {AliOss,getCallbackInfo} from '../../aliyun/aliYun';
import crypto  = require('crypto');
import md5 = require('md5');
const { Models, Fn, Page } = sqlLink;
export default class OssService {
    // 构造
    constructor() {
    }

    /**
     * 获取授权信息
     */
    public static getAliYunOssPolicy(dir:string) {
      try {
        let expireTime = 30;
        let targetDir: any = dir || '';
        let expireEndTime = Date.parse(new Date().toDateString()) + expireTime * 1000;
        let expireEndDate = new Date(expireEndTime);
        expireEndDate.setHours(expireEndDate.getHours(), expireEndDate.getMinutes() - expireEndDate.getTimezoneOffset());
        let expireEndDateGMT = expireEndDate.toISOString();
        let info = getCallbackInfo(targetDir);
        let callbackStr = new Buffer(JSON.stringify({
            callbackUrl: `${config.server.host}/api/AliYunOssCallback`,
            callbackHost: "oss-cn-huhehaote.aliyuncs.com",
            callbackBody: "filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}",
            callbackBodyType: "application/x-www-form-urlencoded"
        }));
        let callbackStr64 = callbackStr.toString('base64');
        let policy = {
            expiration: expireEndDateGMT,
            conditions: [
                {"bucket": "deeplink"}
            ]
        };
        let policyStr = new Buffer(JSON.stringify(policy));
        let policy64 = policyStr.toString('base64');
        let signature = crypto.createHmac('sha1', info.accessKey).update(policy64).digest().toString('base64');
        return {
            code: 200, data: {
                accessid: info.accessId,
                host: info.host,
                policy: policy64,
                signature: signature,
                expire: expireEndTime,
                callback: callbackStr64,
                dir: targetDir
            }
        };
      } catch (e){
        throw new Error(e);
      }
    }

    /**
     * oss回调
     */
    public static AliYunOssCallback() {
      try {
        let headers = {
          host: 'localhost:3000',
          connection: 'close',
          'content-length': '91',
          authorization: 'HHtQ8zgAo4WUCg7Iy/njrsluS+ZDmgMwIHag+vmRvIC4Ph5rxNQ3+WOfJZvzwIKQsNftEDC0PCU03hpjId3vIQ==',
          'content-md5': 'G5H/anNzgdvMS2AsvXpi6A==',
          'content-type': 'application/x-www-form-urlencoded',
          date: 'Sun, 02 Jun 2019 15:13:06 GMT',
          'user-agent': 'aliyun-oss-callback',
          'x-oss-additional-headers': '',
          'x-oss-bucket': 'deeplink',
          'x-oss-owner': '1050784833268046',
          'x-oss-pub-key-url': 'aHR0cHM6Ly9nb3NzcHVibGljLmFsaWNkbi5jb20vY2FsbGJhY2tfcHViX2tleV92MS5wZW0=',
          'x-oss-request-id': '5CF3E7821AB22D0FDB86704D',
          'x-oss-requester': '1050784833268046',
          'x-oss-signature-version': '1.0',
          'x-oss-tag': 'CALLBACK',
          'eagleeye-rpcid': '0.1'
        };
        let authorization64 = headers.authorization;
        let pubKey64 = headers['x-oss-pub-key-url'];
        let pubKey = new Buffer(pubKey64, 'base64').toString();
        let authorization = new Buffer(authorization64, 'base64').toString('utf8');
        let body = {
            filename: 'headSculpture/jikang2.jpg',
            size: '108904',
            mimeType: 'image/jpeg',
            height: '278',
            width: '200'
        }
        let signStr = `/api/AliYunOssCallback?\n${JSON.stringify(body)}`;
        //let signStrMd5 = md5(signStr);
        if(pubKey.indexOf('https://gosspublic.alicdn.com/') == 0) {
            console.log(pubKey);
            console.log(authorization);
            return ({Status: 'OK'});
        } else {
          return({Status: 'verdify not ok', message: '地址来源错误'});
        }
      } catch (e){
        throw new Error(e); 
      }
  }
}
