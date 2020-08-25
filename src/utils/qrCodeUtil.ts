import qr_image = require('qr-image');
class QrCodeUtils {
    // 构造
    constructor() {
    }

    static getQrCodeImageFromUrl(url: string) {
        let temp_qrcode = qr_image.imageSync(url,{ type: 'svg' })
        return temp_qrcode
    }
}
export default QrCodeUtils;
