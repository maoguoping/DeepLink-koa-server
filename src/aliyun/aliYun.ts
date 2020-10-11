import OSS = require('ali-oss');
import ALY = require('aliyun-sdk');
import config from "../../config";
export class AliRam {
    public ram: any;
    constructor() {
        this.ram = new ALY.RAM(config.aliYunRam);
    }
    // 创建角色
    createUser(userid: string) {
        return new Promise(async (resolve, reject) => {
            this.ram.createUser({
                Action: 'CreateUser',
                UserName: userid
            }, (err: Error, res: any) => {
                if(err) {
                    reject(err)
                } else {
                    console.log(err, res);
                }
            });
        })
    }
    //修改角色
    updaterUser(userInfo: any) {
        return new Promise(async (resolve, reject) => {
            this.ram.updateUser({
                Action: 'UpdateUser',
                UserName: userInfo.username,
                NewUserName: userInfo.newUsername,
                NewDisplayName: userInfo.userTickName
            }, (err: Error, res: any) => {
                if(err) {
                    reject(err);
                } else {
                    console.log(err, res);
                    resolve(res);
                }
            });
        })
    }
}
export class AliOss {
    public ossClient:any;
    constructor(OssInfo: any) {
        let opt = {
            region: 'oss-cn-huhehaote',
            accessKeyId: config.aliYunRam.accessKeyId,
            secretAccessKey: config.aliYunRam.secretAccessKey
        };
        opt = Object.assign(opt, OssInfo);
        this.ossClient = new OSS(opt);
    }
    //加载命名空间
    listBuckets () {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.ossClient.listBuckets();
                resolve(result);
            } catch(err) {
                reject(err);
            }
        })
    }
    // putBucket
    putBucket() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.ossClient.putBucket('your bucket name');
                console.log(result);
            } catch (err) {
                console.log(err);
            }
        })
    }
    //获取回调信息

}
export function getCallbackInfo(dir: string) {
    return {
        accessId: config.aliYunRam.accessKeyId,
        accessKey: config.aliYunRam.secretAccessKey,
        endpoint: config.aliYunRam.endpoint,
        bucket: config.aliYunRam.bucket,
        dir,
        host: config.aliYunRam.host
    }
}
