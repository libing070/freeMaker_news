    /**
     * 网络请求 
     * @param folder String    [必填]  上传目录  'demand' , 'employer_profile_photo' ,'freelancer_file_photo' ,'production' ,'profile_photo'
     * @param cropImagePath Object [非必填]  cropImagePath 裁剪的图片路径
     * @param _callback Object [必填]  回调函数 返回上传后的文件全路径
     */

const app = getApp()
var CosAuth = require('./lib/cos-auth');

var uploadFile = function (folder ,_callback,cropImagePath) {
    let cloudImagepath=""
    // 请求用到的参数
    // var prefix = 'https://cos.' + config.Region + '.myqcloud.com/' + config.Bucket + '/'; // 这个是后缀式，签名也要指定 Pathname: '/' + config.Bucket + '/'

    var prefix = 'https://' + app.globalData.Bucket + '.cos.' + app.globalData.Region + '.myqcloud.com/';

    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = function (callback) {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expiredTime) {
            callback(stsCache.credentials);
            return;
        }
        wx.request({
            method: 'GET',
            url: app.globalData.domain + '/v1/file/getTmpSecret', // 服务端签名，参考 server 目录下的两个签名例子
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                if (data.code ===  1) {
                    stsCache = data.data
                } else {
                    wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(stsCache), showCancel: false});
                }
               // callback(stsCache && stsCache.credentials);
                callback(stsCache);
            },
            error: function (err) {
                wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(err), showCancel: false});
            }
        });
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.sessionToken,
                Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname,
                })
            });
        });
    };

    // 上传文件
    var uploadFile = function (filePath) {
        wx.showLoading({
            title: '正在上传...',
            mask: true,
        })

        var date=new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
        var Key = folder + '/' + date + '/'+ filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        getAuthorization({Method: 'POST', Pathname: '/'}, function (AuthData) {
            var requestTask = wx.uploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: {
                    'key':  Key,
                    'success_action_status': 200,
                    'Signature': AuthData.Authorization,
                    'x-cos-security-token': AuthData.XCosSecurityToken,
                    'Content-Type': '',
                },
                success: function (res) {
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if(res.statusCode === 200){
                        _callback({fullPath:url,filePath: camSafeUrlEncode(Key).replace(/%2F/g, '/')})
                    }else{
                        wx.showToast({
                          title: '上传失败',
                          icon: 'none',
                          duration:1500,
                       })
                    }
                },
                fail: function (res) {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration:1500,
                 })
                },
                complete:()=>{
                    wx.hideLoading() 
                }
            });
            requestTask.onProgressUpdate(function (res) {
                console.log('正在进度:', res);
            });
        });
    };

    if(cropImagePath){
        uploadFile(cropImagePath);
    }else{
        // 选择文件
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，这里默认用原图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                uploadFile(res.tempFiles[0].path);
            }
        })
    }

};

module.exports = uploadFile;
