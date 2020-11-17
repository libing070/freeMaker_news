// pages/extDemandDetails/extDemandDetails.js
const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        isIosSystem:app.isIosSystem,
        shareTitle:'我在HOWWORK发现一好活',
        title:'',
        markList:[],
        price:'',
        timestr:'',
        budgetType:1,
        currentPage:1,
        productionList:[],
        orderReceived:false,//是否已接单
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            code:options.code
        })

        let allP=[]
        allP.push(this.loadDetails())
        Promise.all(allP).then((result) => {
            this.startDraw()
        }).catch((error) => {

        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loginSuccess()

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    // mark: 授权成功
    authSuccess(login) {
        if(login){
            this.setData({
                showAuthPhone:true //打开获取手机号自定义弹窗
            })
        }
    },
    // mark: 登录成功 （获取手机号成功）
    loginSuccess(login){
        this.setData({
            user: app.user,
        })

        if (login) {
            this.setData({
                showAuthModal:false,
                showAuthPhone:false
            })
            this.getProductionListByFreelancerId()
            this.findRecommend()
            this.loadDetails()
        }

    },
    //mark: 重新登录
    Relogin(){
        this.setData({
         showAuthModal:true
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.shareTitle,
            path: '/pages/extDemandDetails/extDemandDetails?code='+this.data.code,
            imageUrl:this.data.poster
          }
    },
    //加载详情
    loadDetails(){
        return new Promise((resolve, reject) => {

            if(app.user){
                REST.get({
                    url: API.getDemandCenterDtlByCode,
                    data:{ code: this.data.code },
                    success: res => {
                        this.setData({
                            demandId:res.id,
                            title:res.summarize,
                            markList:[res.jobCateIdName],
                            price:res.budget+"",
                            budgetType:res.budgetType,
                            description:res.description,
                            expectDeliveryTime:res.expectDeliveryTime,
                            deliveryTypeName:res.deliveryTypeName,
                            employerInfo:res.employerInfo,
                            employerName:res.employerName,
                            companyName:res.companyName,
                            employerId:res.employerId,//发布需求者ID
                            userEmployerId:res.userEmployerId,//当前登陆者ID
                            timestr:'期望交付时间: '+res.expectDeliveryTime
                        })  
                        resolve() 
                    },
                    fail: res => {
                        wx.showToast({
                            title: '获取失败',
                            icon: 'none',
                            duration: 2000
                        });
                        reject();
    
                    },
                }) 
            }else{
                REST.noVerfiyget({
                    url: API.getDemandCenterDtlByCode,
                    data:{ code: this.data.code },
                    success: res => {
                        this.setData({
                            demandId:res.id,
                            title:res.summarize,
                            markList:[res.jobCateIdName],
                            price:res.budget+"",
                            budgetType:res.budgetType,
                            description:res.description,
                            expectDeliveryTime:res.expectDeliveryTime,
                            deliveryTypeName:res.deliveryTypeName,
                            employerInfo:res.employerInfo,
                            employerName:res.employerName,
                            companyName:res.companyName,
                            employerId:res.employerId,//发布需求者ID
                            userEmployerId:res.userEmployerId,//当前登陆者ID
                            timestr:'期望交付时间: '+res.expectDeliveryTime
                        })  
                        resolve() 
                    },
                    fail: res => {
                        wx.showToast({
                            title: '获取失败',
                            icon: 'none',
                            duration: 2000
                        });
                        reject();
    
                    },
                }) 
            }
        })
 
    },
    //开始绘分享卡片内容
    startDraw(){
        let width = 422, height = 340
        this.setData({
            canvasSize: `width: ${width}px; height: ${height}px;`,
        },() => {
            let context = wx.createCanvasContext('poster', this)
                // 圆角白底
                context.moveTo(0, 20)
                context.arcTo(0, 0, 20, 0, 20)
                context.arcTo(width, 0, width, 20, 20)
                context.arcTo(width, height, width - 20, height, 20)
                context.arcTo(0, height, 0, height - 20, 20)
                context.closePath()
                context.fillStyle = 'white'
                context.fill()

                // 背景图
                context.save()
                context.clip()
                context.drawImage('/images/common/pic_bg_share@2x.png', 0, 0)
                context.restore()

                //标题
                context.font = 'normal bold 26px sans-serif'
                context.fillStyle = '#0C2032'
                context.fillText(this.data.title.length >= 15 ? this.data.title.substring(0,15) + '...':this.data.title, 10, 40)

                if(this.data.markList.length&& this.data.markList[0]!=null){
                    //mark 绘制并填充一个圆角矩形  
                    context.font = 'normal 20px sans-serif'
                    const tagWidth = context.measureText(this.data.markList[0])
                    this.fillRoundRect(context, 20, 66, 10 + tagWidth.width + 10, 36, 8, '#F4F4F4');

                    //tag文本
                    context.font = 'normal 20px sans-serif'
                    context.fillStyle = '#8392A0'
                    context.fillText(this.data.markList[0], 30, 92)
                }
                

                if(this.data.budgetType == 0 ){//时薪
                    //价格
                    context.font = 'normal bold '+ (Number(this.data.price) >= 100000 ? '68':'76') +'px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText(this.data.price, 102, 200)

                    //单位
                    const priceWidth = context.measureText(this.data.price+"")
                    context.font = 'normal bold 24px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText('元/时', 102 + priceWidth.width , 192)
                }else if(this.data.budgetType == 1 ){//一口价
                    //单位
                    context.font = 'normal bold 24px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText('一口价', 60 , 192)

                    //价格
                    const unitWidth = context.measureText('一口价')
                    context.font = 'normal bold '+ (Number(this.data.price) >= 100000 ? '68':'76') +'px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText(this.data.price, 60 + unitWidth.width, 200)

                    //单位
                    const priceWidth = context.measureText(this.data.price+"")
                    context.font = 'normal bold 24px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText('元', 60 +unitWidth.width +priceWidth.width , 192)

                }else if(this.data.budgetType == 2 ){//面议
                    //价格
                    context.font = 'normal bold 76px sans-serif'
                    context.fillStyle = '#FFBA20'
                    context.fillText('面议', 102, 200)
                }
                

                //时间
                context.font = 'normal bold 24px sans-serif'
                context.fillStyle = '#8392A0'
                context.fillText(this.data.timestr, 20, 260)

                // 图标
                let icon = {
                    x: 20,
                    y: 290,
                    s: 23,
                }
                context.save()
                context.beginPath()
                context.arc(icon.x + icon.s / 2, icon.y + icon.s / 2, icon.s / 2, 0, 2 * Math.PI)
                context.closePath()
                context.clip()
                context.drawImage('/images/common/icon_auth.png', icon.x, icon.y, icon.s, icon.s)
                context.restore()

                //auth
                context.font = 'normal bold 24px sans-serif'
                context.fillStyle = '#6F96BA'
                context.fillText('需求经平台认证', 20 + 26 , 310)

                context.draw(true, res => {
                    if (res.errMsg == "drawCanvas:ok") {
                        // 导出文件
                        wx.canvasToTempFilePath({
                            canvasId: 'poster',
                            destWidth: width * 3,
                            destHeight: height * 3,
                            success: res => {

                                this.setData({
                                    canvasSize: null,
                                    poster: res.tempFilePath,
                                })
                            },
                            fail: res => {
                            }
                        }, this)

                    } else {
                    }
                })
        })
    
        
    },
    /**该方法用来绘制一个有填充色的圆角矩形 
     *@param cxt:canvas的上下文环境 
     *@param x:左上角x轴坐标 
     *@param y:左上角y轴坐标 
     *@param width:矩形的宽度 
     *@param height:矩形的高度 
     *@param radius:圆的半径 
     *@param fillColor:填充颜色 
     **/
    fillRoundRect(cxt, x, y, width, height, radius, fillColor) {
        //圆的直径必然要小于矩形的宽高          
        if (2 * radius > width || 2 * radius > height) { return false; }

        cxt.save();
        cxt.translate(x, y);
        //绘制圆角矩形的各个边  
        this.drawRoundRectPath(cxt, width, height, radius);
        cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
        cxt.fill();
        cxt.restore()
    },
    drawRoundRectPath(cxt, width, height, radius) {
        cxt.beginPath(0);
        //从右下角顺时针绘制，弧度从0到1/2PI  
        cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

        //矩形下边线  
        cxt.lineTo(radius, height);

        //左下角圆弧，弧度从1/2PI到PI  
        cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

        //矩形左边线  
        cxt.lineTo(0, radius);

        //左上角圆弧，弧度从PI到3/2PI  
        cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

        //上边线  
        cxt.lineTo(width - radius, 0);

        //右上角圆弧  
        cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

        //右边线  
        cxt.lineTo(width, height - radius);
        cxt.closePath();
    },
    strlen(str){
        var len = 0;  
        for (var i=0; i<str.length; i++) {   
         var c = str.charCodeAt(i);   
        //单字节加1   
         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
           len++;   
         }   
         else {   
          len+=2;   
         }   
        }   
        return len;  
    },
    //一键呼叫
    freeTell(e){
        let content = e.currentTarget.dataset.content;
        wx.makePhoneCall({

            phoneNumber: content,
      
          })
    },
    //获取已发布审核通过的作品数量
    getProductionListByFreelancerId() {
        return new Promise((resolve, reject) => {
            let that = this
            REST.get({
                url: API.getByLoginUser,
                data: {
                    currentPage: this.data.currentPage,
                    pageSize: 10000
                },
                success:(res)=> {
                    if(!res.data) return
                    let productionList=[]
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].status == 40)
                        productionList.push(res.data[i])
                    }
                    this.setData({
                        productionList
                    })
                    resolve()
                },
                failed(res) {
                    console.error(res)
                    reject()
                },
                complete(res) {
                }
            })
        })
       
    },
    //申请接单
    tapApplyOrder(){
        // 未登录
        if (!app.user) {
            this.setData({
                showAuthModal: true
            })
            return
        } 

        if(this.data.employerId == this.data.userEmployerId){
            wx.showToast({
                title: '不能申请自己发布的需求哦',
                icon: 'none',
                duration: 2000
            });
            return
            
        }
        if(this.data.orderReceived){
            wx.showToast({
                title: '您已申请接单啦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.productionList.length == 0){ //没有作品
            let allP=[]
            allP.push(this.getProductionListByFreelancerId())
            Promise.all(allP).then((result) => {
                if(this.data.productionList.length == 0){
                    wx.navigateTo({
                        url: '/pages/moveinGuide/moveinGuide',
                    })
                }else{
                    wx.navigateTo({
                        url: '/pages/canOrdersList/canOrdersList?demandId=' + this.data.demandId,
                    })
                }
            }).catch((error) => {})
        }else{
            wx.navigateTo({
                url: '/pages/canOrdersList/canOrdersList?demandId=' + this.data.demandId,
            }) 
        }

    },
    //是否以及申请过接单
    findRecommend(){
        let that = this
        REST.get({
            url: API.findRecommend,
            data: {
                demandId: this.data.demandId,
            },
            success:(res)=> {
                this.setData({
                    orderReceived:res
                })
            },
            failed(res) {
                
            },
            complete(res) {
            }
        })
    }

})