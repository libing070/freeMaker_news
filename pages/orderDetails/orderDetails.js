const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")
const util = require("../../utils/util.js")

const app = getApp()
const uploadFile = require("./../../utils/upload.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIosSystem:app.isIosSystem,
        safeBottom: app.safeBottom,
        imagesList: [], //图片
        shadeShowing: false,
        total: 0,
        summarize: '',
        orderBelongType: 10, //10 雇佣者 ，20自由职业者
        currentStep: '', //当前步骤
        isreject: false, //是否验收不通过
        attachmentList:[],//完成制作、验收不通过的附件图片
        followDesc:'',//完成制作、验收不通过的文字描述
        failedReasonList:[],
        steps: [{
            undo: '下单',
            done: '下单'
        }, {
            undo: '待接单',
            done: '接单',
            stop: '取消'
        }, {
            undo: '待支付',
            done: '支付',
            stop: '取消'
        }, {
            undo: '制作中',
            done: '制作'
        }, {
            undo: '待验收',
            done: '验收',
            stop:'验收不通过'
        }, {
            undo: '完成',
            done: '完成'
        }, {
            undo: '待评价',//为了适应显示，唯一一组违反语义的值
            done: '评价'//为了适应显示，唯一一组违反语义的值
        }],
        orderStatus:{
            INIT_10:10,   //已下单, 0
            WAITING_20: 20, //待接单 1
            REJECT_30:30, //已拒单, 1
            TAKING_40:40, //已接单,待支付 2
            CANCELD_100:100, // 已取消 2
            PAID_50:50,   //已支付, 制作中 3
            CHECKING_60:60,   //待验收, 4
            CHECK_FAIL_61:61,   //重新验收, 4
            CHECK_FAIL_70:70, //验收不通过, 4
            FINISHED_80:80,   //已完成, 5
            FINISHED_81:81,      //终止交易
            EVALUATED_90:90   //已评价, 6
        },
        canClick: false,
        orderId: 0, //订单ID
        orderDetail: {},
        evaluationInfo:'',
        num: 4,//后端给的订单评价分数，显示的星星
        one_1: '',//点亮的星星数
        two_1: '',//没有点亮的星星数

        
        appraiseStarSelNum:0,//总体评价点亮总数
        appraiseMsg:'',

        appraiseChildsStarSelNum1: 0, //响应速度点亮数
        appraiseChildsStarSelNum2: 0 ,//沟通能力点亮数
        appraiseChildsStarSelNum3: 0 ,//完成时间点亮数
        appraiseChildsStarSelNum4: 0 ,//完成质量点亮数
        appraiseChildsStarSelNum5: 0 ,//推荐意愿点亮数
        appraisemarkList:[
        ],

        appraiseImagesList: [], //评价图片
        appraiseTotal:0,

        currRadioCheckstatusIndex:'', //1 验收通过 ，2 验收不通过
        isRadiochecked:false,

        //评价
        stars: [0, 1, 2, 3, 4],
        normalSrc: '/images/common/star/icon-normal.png',   
        half_0_1_point5_src:"/images/common/star/icon-half-0.5-1.5.png",
        half_2_point5_src:"/images/common/star/icon-half-2.5.png",
        half_3_point5_src:"/images/common/star/icon-half-3.5.png",
        half_4_point5_src: '/images/common/star/icon-half-4.5.png',
        selected_1_2_src: '/images/common/star/icon-selected-1-2.png',
        selected_3_src: '/images/common/star/icon-selected-3.png',
        selected_4_src: '/images/common/star/icon-selected-4.png',
        selected_5_src: '/images/common/star/icon-selected-5.png',
        starMinX:[], //下标0总体评分x坐标位置,下标1子评分x坐标位置
        appraiseMsgList:['极差',"差","一般","棒","非常棒"]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //禁止转发 分享朋友圈
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.data.orderId = options.orderId
        this.getOrderDetail()

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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
            this.getOrderDetail()
        }

    },
    //mark: 重新登录
    Relogin(){
        this.setData({
         showAuthModal:true
        })
    },
    //跳转到需求推送人列表
    tapToPushUserList() {
        wx.navigateTo({
            url: '/pages/pushUserList/pushUserList',
        })
    },
    //显示隐藏
    shadeShowing(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing,
                currPicker: e.currentTarget.dataset.type
            });
            // if(e.currentTarget.dataset.type && e.currentTarget.dataset.type != "appraise"){
            //     this.updateOrderStatus(this.data.orderStatus.MAKING_50)
            // }

            
            if(e.currentTarget.dataset.type == "appraise"){
                let starMinXList = []
                let allP = [];
                let p0 = new Promise((resolve, reject) => {
                    wx.createSelectorQuery().select('#appraise0').boundingClientRect(res=>{
                        starMinXList.push(res.left)//总评分的起点坐标
                        resolve();
                    }).exec()
                });
                allP.push(p0);

                let p1 = new Promise((resolve, reject) => {
                    wx.createSelectorQuery().select('#appraiseChild').boundingClientRect(res=>{
                        starMinXList.push(res.left)//子评分起点坐标
                        resolve();
                    }).exec()
                });
                allP.push(p1);
                Promise.all(allP).then((result) => {
                    this.setData({
                        starMinX:starMinXList
                    });
                  //  console.log(this.data.starMaxX)
                }).catch((error) => {
        
                })
            

                REST.get({
                    url: API.getTagByJobCateId,
                    data: {
                        jobCateId: this.data.orderDetail.jobCateId
                    },
                    success:res => {
                        let skillList = []
                        res.forEach(item => {
                            const skill = {
                                id: item.id,
                                name: item.tagName,
                                select: false
                            }
                            skillList.push(skill)
                        })

                        this.setData({
                            appraisemarkList: skillList
                        })

                    },
                    failed(res) {
                        console.error(res)
                    },
                    complete(res) {
                    }
                })
            }
        }
    },
    //点击左边,半颗星
    selectLeft: function (e) {
        var type = e.currentTarget.dataset.type
        this.setData({
            [`appraiseType${type}`]:type,
        })
        var key = e.currentTarget.dataset.key
        if (this.data.key0 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key = 0;
        }
        console.log("得" + key + "分")
        if(key == 0){
            this.setData({[`key${type}`]:key})
        }else if(key == 0.5){
            this.setData({[`key${type}`]:key,[`half${type}`] :this.data.half_0_1_point5_src,[`selected${type}`] :this.data.selected_1_2_src})
        }else if(key == 1.5){
            this.setData({[`key${type}`]:key,[`half${type}`] :this.data.half_0_1_point5_src,[`selected${type}`] :this.data.selected_1_2_src})
        }else if(key == 2.5){
            this.setData({[`key${type}`]:key,[`half${type}`] :this.data.half_2_point5_src,[`selected${type}`] :this.data.selected_3_src})
        }else if(key == 3.5){
            this.setData({[`key${type}`]:key,[`half${type}`] :this.data.half_3_point5_src,[`selected${type}`] :this.data.selected_4_src})
        }else if(key == 4.5){
            this.setData({[`key${type}`]:key,[`half${type}`] :this.data.half_4_point5_src,[`selected${type}`] :this.data.selected_5_src})
        }
        this.setData({
            [`appraiseMsg${type}`]:this.data['key'+type]<= 1 ? '极差' :this.data['key'+type] <= 2 ? '差' :this.data['key'+type] <= 3 ? '一般' :this.data['key'+type] <= 4 ? '棒' :'超级棒',
        }) 
        if(type == 0){
            this.setData({
                appraiseStarSelNum:this.data['key'+type],
                appraiseplaceholder:this.data['key'+type] <=2 ? '十分抱歉，请您消消气，有问题我们全力帮您解决':this.data['key'+type] <=3.5 ? '请留下您宝贵的意见，我们一定努力改进':this.data['key'+type] <=4.5 ? '请分享您的使用感受吧':'感谢您对人才的认可，期待看到您的进一步评价吆'
            })
        }else if(type == 1){
            this.setData({
                appraiseChildsStarSelNum1:this.data['key'+type],
            })
        }else if(type == 2){
            this.setData({
                appraiseChildsStarSelNum2:this.data['key'+type],
            })
        }else if(type == 3){
            this.setData({
                appraiseChildsStarSelNum3:this.data['key'+type],
            })
        }else if(type == 4){
            this.setData({
                appraiseChildsStarSelNum4:this.data['key'+type],
            })
        }else if(type == 5){
            this.setData({
                appraiseChildsStarSelNum5:this.data['key'+type],
            })
        }
        this.watchOperation()
    },
    //点击右边,整颗星
    selectRight: function (e) {
        var type = e.currentTarget.dataset.type
        this.setData({
            [`appraiseType${type}`]:type,
        })
        var key = e.currentTarget.dataset.key
        console.log("得" + key + "分")
        if(key ==1){
            this.setData({[`key${type}`]:key,[`selected${type}`] :this.data.selected_1_2_src,[`half${type}`] :this.data.half_0_1_point5_src})
        }else if(key ==2){
            this.setData({[`key${type}`]:key,[`selected${type}`] :this.data.selected_1_2_src,[`half${type}`] :this.data.half_0_1_point5_src})
        }else if(key == 3){
            this.setData({[`key${type}`]:key,[`selected${type}`] :this.data.selected_3_src,[`half${type}`] :this.data.half_2_point5_src})
        }else if(key == 4){
            this.setData({[`key${type}`]:key,[`selected${type}`] :this.data.selected_4_src,[`half${type}`] :this.data.half_3_point5_src})
        }else if(key == 5){
            this.setData({[`key${type}`]:key,[`selected${type}`] :this.data.selected_5_src,[`half${type}`] :this.data.half_4_point5_src})
        }
        this.setData({
            [`appraiseMsg${type}`]:this.data['key'+type]<= 1 ? '极差' :this.data['key'+type] <= 2 ? '差' :this.data['key'+type] <= 3 ? '一般' :this.data['key'+type] <= 4 ? '棒' :'超级棒',

        }) 
        if(type == 0){
            this.setData({
                appraiseStarSelNum:this.data['key'+type],
                appraiseplaceholder:this.data['key'+type] <=2 ? '十分抱歉，请您消消气，有问题我们全力帮您解决；':this.data['key'+type] <=3.5 ? '请留下您宝贵的意见，我们一定努力改进；':this.data['key'+type] <=4.5 ? '请分享您的使用感受吧；':'感谢您对人才的认可，期待看到您的进一步评价吆；'
            })
        }else if(type == 1){
            this.setData({
                appraiseChildsStarSelNum1:this.data['key'+type],
            })
        }else if(type == 2){
            this.setData({
                appraiseChildsStarSelNum2:this.data['key'+type],
            })
        }else if(type == 3){
            this.setData({
                appraiseChildsStarSelNum3:this.data['key'+type],
            })
        }else if(type == 4){
            this.setData({
                appraiseChildsStarSelNum4:this.data['key'+type],
            })
        }else if(type == 5){
            this.setData({
                appraiseChildsStarSelNum5:this.data['key'+type],
            })
        }
        this.watchOperation()
    },
    changeScore(e){
        var type = e.currentTarget.dataset.type
        this.setData({
            [`appraiseType${type}`]:type,
        })
        var num = 0;//临时数字,动态确定要传入的分数
        var touchX = e.touches[0].pageX;//获取当前触摸点X坐标
        var starMinX = type == 0 ? this.data.starMinX[0]:this.data.starMinX[1];//最左边第一颗星的X坐标
        var starWidth = type == 0 ? 30: (24 + 6);//星星图标的宽度 子星星 6是padding
        var starLen =  type == 0 ? 15 : 5;//星星之间的距离
        var starMaxX = starWidth * 5 + starLen * 4 + starMinX;//最右侧星星最右侧的X坐标,需要加上5个星星的宽度和4个星星间距 和起始位置的坐标
        // console.log("touchX: "+touchX+ ", starMinX:" + starMinX + ", starMaxX: "+ starMaxX);
        if (touchX > starMinX && touchX < starMaxX) {//点击及触摸的初始位置在星星所在空间之内
            num = (touchX - starMinX) / (starWidth + starLen);   
            console.log(num)       
            if(0 <=num && num <= 0.5){
                this.setData({[`key${type}`]: 0.5,[`half${type}`]:this.data.half_0_1_point5_src})
            }else if(0.5 <num && num<= 1){
                this.setData({[`key${type}`]: 1,[`selected${type}`]:this.data.selected_1_2_src})
            }else if(1 <num && num<= 1.5){
                this.setData({[`key${type}`]: 1.5,[`half${type}`]:this.data.half_0_1_point5_src})
            }else if(1.5 <num && num<= 2){
                this.setData({[`key${type}`]: 2,[`selected${type}`]:this.data.selected_1_2_src})
            }else if(2 <num && num<= 2.5){
                this.setData({[`key${type}`]: 2.5,[`half${type}`]:this.data.half_2_point5_src,[`selected${type}`] :this.data.selected_3_src})
            }else if(2.5 <num && num<= 3){
                this.setData({[`key${type}`]: 3,[`selected${type}`]:this.data.selected_3_src})
            }else if(3 <num&& num <= 3.5){
                this.setData({[`key${type}`]: 3.5,[`half${type}`]:this.data.half_3_point5_src,[`selected${type}`] :this.data.selected_4_src})
            }else if(3.5 <num && num<= 4){
                this.setData({[`key${type}`]: 4,[`selected${type}`]:this.data.selected_4_src})
            }else if(4 <num && num<= 4.5){
                this.setData({[`key${type}`]: 4.5,[`half${type}`]:this.data.half_4_point5_src,[`selected${type}`] :this.data.selected_5_src})
            }else  if(num>4.5){
                this.setData({[`key${type}`]: 5,[`selected${type}`]:this.data.selected_5_src})
            }
            
        }else if(touchX < starMinX){//如果点击或触摸位置在第一颗星星左边,则恢复默认值,否则第一颗星星会一直存在
            this.setData({[`key${type}`]: ''})
        }

        this.setData({
            [`appraiseMsg${type}`]:this.data['key'+type]<= 1 ? '极差' :this.data['key'+type] <= 2 ? '差' :this.data['key'+type] <= 3 ? '一般' :this.data['key'+type] <= 4 ? '棒' :'超级棒',
        }) 
        if(type == 0){
            this.setData({
                appraiseStarSelNum:this.data['key'+type],
                appraiseplaceholder:this.data['key'+type] <=2 ? '十分抱歉，请您消消气，有问题我们全力帮您解决；':this.data['key'+type] <=3.5 ? '请留下您宝贵的意见，我们一定努力改进；':this.data['key'+type] <=4.5 ? '请分享您的使用感受吧；':'感谢您对人才的认可，期待看到您的进一步评价吆；'
            })
        }else if(type == 1){
            this.setData({
                appraiseChildsStarSelNum1:this.data['key'+type],
            })
        }else if(type == 2){
            this.setData({
                appraiseChildsStarSelNum2:this.data['key'+type],
            })
        }else if(type == 3){
            this.setData({
                appraiseChildsStarSelNum3:this.data['key'+type],
            })
        }else if(type == 4){
            this.setData({
                appraiseChildsStarSelNum4:this.data['key'+type],
            })
        }else if(type == 5){
            this.setData({
                appraiseChildsStarSelNum5:this.data['key'+type],
            })
        }

        this.watchOperation()

    },

    // 评价提交
    tapshadeAppraiseSubmit() {
        if (this.data.appraiseStarSelNum == 0 || this.data.appraiseChildsStarSelNum1 == 0 ||this.data.appraiseChildsStarSelNum2 == 0 ||this.data.appraiseChildsStarSelNum3 == 0||this.data.appraiseChildsStarSelNum4 == 0||this.data.appraiseChildsStarSelNum5 == 0) {
            wx.showToast({
                title: '您还没有为人才打分',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            shadeShowing: !this.data.shadeShowing,
            currPicker: ''
        });

        let tags = []
        this.data.appraisemarkList.forEach(item => {
            if (item.select) {
                tags.push({
                    id: item.id
                })
            }
        })

        REST.post({
            url: API.publishEvaluation,
            data: {
                orderId: this.data.orderId,
                totalScore: this.data.appraiseStarSelNum.toFixed(2),
                responseSpeed: this.data.appraiseChildsStarSelNum1.toFixed(2),// 响应速度
                communicateCapacity: this.data.appraiseChildsStarSelNum2.toFixed(2),//沟通能力
                completionTime : this.data.appraiseChildsStarSelNum3.toFixed(2),//完成时间
                accomplishQuality : this.data.appraiseChildsStarSelNum4.toFixed(2),//完成质量
                recommendScore: this.data.appraiseChildsStarSelNum5.toFixed(2),//推荐意愿
                description: this.data.appraiseSummarize,
                bdJobTags: tags,
                images: this.data.appraiseImagesList

            },
            success:res => {
                this.getOrderDetail()
                wx.showToast({
                    title: '评价成功',
                    duration: 1000
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },

    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
        }).exec()

    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
        let desc = this.deleteHtmlTag(e.detail.html);
        if (desc.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: desc.length,
            followDesc: desc
        });
        this.watchOrderFollow()
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
        var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
        return dds
    },
    //制作完成  验收不通过上传图片凭证
    tapUpload(e) {
        if (this.data.attachmentList.length >= 8) {
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        //参数详见 :utils/upload.js 
        uploadFile('order',(filePath)=>{
            let attachment = {
                    path: filePath.filePath, //相对路径
                    otherPath:filePath.filePath, //相对路径
                    fullPath:filePath.fullPath, //全路径
            }
            this.data.attachmentList.push(attachment)
            this.setData({
                attachmentList: this.data.attachmentList
            })

            this.watchOrderFollow()
        })

        // wx.chooseImage({
        //     count: 8 - this.data.attachmentList.length,
        //     sizeType: ['compressed'],
        //     success: (res) => {
        //         this.setData({
        //             attachmentList: this.data.attachmentList.concat(res.tempFilePaths)
        //         });
        //         this.watchOrderFollow()
        //     }
        // });
    },
    //删除图片
    deletePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        this.data.attachmentList.splice(currIndex, 1);
        this.setData({
            attachmentList: this.data.attachmentList,
        })
        this.watchPayFollow()
    },
    // 点击图片
    tapBanner(e) {
        let current = e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.attachmentList) {
            urls.push(item.fullPath)
        }

        wx.previewImage({
            current,
            urls,
        })
    },
    //一键复制
    tapCopy(e) {
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success(res) {
            }
        })
    },
    //评价使用
    watchOperation() {        
        if (this.data.appraiseStarSelNum == 0 || this.data.appraiseChildsStarSelNum1 == 0 ||this.data.appraiseChildsStarSelNum2 == 0 ||this.data.appraiseChildsStarSelNum3 == 0||this.data.appraiseChildsStarSelNum4 == 0||this.data.appraiseChildsStarSelNum5 == 0) {
            this.setData({
                canClick: false
            })
        } else {
            this.setData({
                canClick: true
            })
        }
    },
    watchOrderFollow() {
        if (this.data.total == 0 || this.data.attachmentList.length == 0) {
            this.setData({
                canClick: false
            })
        } else {
            this.setData({
                canClick: true
            })
        }
    },
    //支付
    payOrder(event) {
        //todo zyc mock订单数据
        let that=this
        wx.requestPayment({
            timeStamp: '123456',
            nonceStr: 'test',
            package: 'test',
            signType: 'test',
            paySign: 'test',
            success(res) {},
            fail(res) {},
            complete(res) {
                that.updateOrderStatus(event.currentTarget.dataset.status)
            }
        })
    },
    //订单状态变更
    updateOrderStatus(status,attachmentList,followDesc) {
        let that = this
        REST.put({
            url: API.updateOrderStatus,
            data: {
                id: this.data.orderId,
                status: status,
                attachmentList: attachmentList,
                followDesc:followDesc
            },
            success: (data) => {
                that.getOrderDetail()
                this.setData({
                    shadeShowing: false,
                    attachmentList:[]
                })
            },
            failed: (resp) => {}
        })
    },
    //验收不通过提交事件
    tapshadeNopass() {
        if (this.data.total == 0) {
            wx.showToast({
                title: '请填写验收不通过理由',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.attachmentList.length == 0) {
            wx.showToast({
                title: '至少上传一张图片',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.currRadioCheckstatusIndex == 81){//仍然不通过
            this.updateOrderStatus(this.data.orderStatus.FINISHED_81,this.data.attachmentList,this.data.followDesc)
        }else{
            this.updateOrderStatus(this.data.orderStatus.CHECK_FAIL_70,this.data.attachmentList,this.data.followDesc)
        }
        wx.showToast({
            title: '提交成功',
            duration: 1000
        })

    },
    //确认验收
    confirmAgree() {
        this.updateOrderStatus(this.data.orderStatus.FINISHED_80)
        this.setData({
            shadeShowing: false
        })
    },
    //取消订单
    tapCancelOrder(e) {
        let that = this
        wx.showModal({
            title: '提示信息',
            content: '确认取消订单？',
            showCancel: true,
            confirmColor: '#FFBA20',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.updateOrderStatus(e.currentTarget.dataset.status)
                    wx.showToast({
                        title: '取消订单成功',
                        duration: 1000
                    })                    
                    wx.navigateBack({
                        delta: 1,
                        success: function (e) {
                            let page = getCurrentPages().pop();
                            if (page == undefined || page == null) {
                                return
                            };
                            page.onLoad();
                        }
                    })
                }
            }
        })
    },
    getOrderDetail(){
        REST.get({
            url: API.getOrderDetail,
            data: {
                id: this.data.orderId
            },
            success:res => {
                this.setData({
                    orderDetail: res,
                    currentStep: res.statusStep,
                    orderBelongType: res.orderBelongType
                });

                this.getOrderEvaluation()
                this.getFailedReason()
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },
    getOrderEvaluation() {
        REST.get({
            url: API.findByOrderId,
            data: {
                orderId: this.data.orderId
            },
            success:res => {
                if(res!=null){
                    res.description = util.deleteHtmlTag(res.description)
                
                    let key =res.totalScore
                    if(key == 0.5){
                        this.setData({key:key,half :this.data.half_0_1_point5_src,selected :this.data.selected_1_2_src})
                    }else if(key == 1.5){
                            this.setData({key:key,half :this.data.half_0_1_point5_src,selected :this.data.selected_1_2_src})
                    }else if(key == 2.5){
                            this.setData({key:key,half :this.data.half_2_point5_src,selected :this.data.selected_3_src})
                    }else if(key == 3.5){
                            this.setData({key:key,half :this.data.half_3_point5_src,selected :this.data.selected_4_src})
                    }else if(key == 4.5){
                            this.setData({key:key,half :this.data.half_4_point5_src,selected :this.data.selected_5_src})
                    }else if(key ==1){
                        this.setData({key:key,selected :this.data.selected_1_2_src,half :this.data.half_0_1_point5_src})
                    }else if(key ==2){
                        this.setData({key:key,selected :this.data.selected_1_2_src,half :this.data.half_0_1_point5_src})
                    }else if(key == 3){
                        this.setData({key:key,selected :this.data.selected_3_src,half :this.data.half_2_point5_src})
                    }else if(key == 4){
                        this.setData({key:key,selected :this.data.selected_4_src,half :this.data.half_3_point5_src})
                    }else if(key == 5){
                        this.setData({key:key,selected :this.data.selected_5_src,half :this.data.half_4_point5_src})
                    }
                    this.setData({
                        evaluationInfo: res 
                    });
                }


            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })

    },
    //复制汇款账号
    copyBankAccount(e) {
        wx.setClipboardData({
            data: '0200004509200165937',
            success(res) {
            }
        })
    },
    //复制微信号
    copyWeChat(e) {
        wx.setClipboardData({
            data: 'HowWork001',
            success(res) {
            }
        })
    },
    //总体评价选择
    tapAppraiseStar(e){
        let sel =  e.currentTarget.dataset.sel
        let index =  Number(e.currentTarget.dataset.index)
        if(sel === 'sel'){//点击的是高亮
             this.setData({
                appraiseStarSelNum: index
             })
        }else{
            this.setData({
                appraiseStarSelNum: (index + 1)
             })
        }
        let appraiseStarSelNum = this.data.appraiseStarSelNum
        this.setData({
            appraiseMsg:appraiseStarSelNum == 1 ? '极差' :appraiseStarSelNum == 2 ? '差' :appraiseStarSelNum == 3 ? '一般' :appraiseStarSelNum == 4 ? '棒' :'超级棒',
            appraiseChildsStarSelNum1:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum1,
            appraiseChildsStarSelNum2:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum2,
            appraiseChildsStarSelNum3:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum3,
        })
        this.watchOperation()
    },
    //结果打分
    tapAppraiseChildsStar(e){
        let type =  e.currentTarget.dataset.type
        let sel =  e.currentTarget.dataset.sel
        let index =  Number(e.currentTarget.dataset.index)
        if(sel === 'sel'){//点击的是高亮
            if(type == 1){
                this.setData({
                    appraiseChildsStarSelNum1: index
                 })
            }else if(type ==2){
                this.setData({
                    appraiseChildsStarSelNum2: index
                 })
            }else if(type == 3){
                this.setData({
                    appraiseChildsStarSelNum3: index
                 })
            }

        }else{
            if(type == 1){
                this.setData({
                    appraiseChildsStarSelNum1: (index + 1)
                 })
            }else if(type ==2){
                this.setData({
                    appraiseChildsStarSelNum2: (index + 1)
                 })
            }else if(type == 3){
                this.setData({
                    appraiseChildsStarSelNum3: (index + 1)
                 })
            }


        }
        this.watchOperation()

    },
    //点击评价标签事件
    tapChooseAppraiseMarks(e) {
        let id = e.currentTarget.dataset.id
        this.setData({
            [`appraisemarkList[${id}].select`]: !this.data.appraisemarkList[id].select,
        })
    },
    //编辑器内容改变时触发
    bindAppraiseEditorInput(e) {
        //let summarize = this.deleteHtmlTag(e.detail.html);
        let summarize =e.detail.value;
        if (summarize.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            appraiseTotal: summarize.length,
            appraiseSummarize: summarize
        });
    },
    //上传评价作品
    tapAppraiseUpload(e) {
        if (this.data.appraiseImagesList.length >= 8) {
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }

        //参数详见 :utils/upload.js 
        uploadFile('appraise',(filePath)=>{
            let attachment = {
                    path: filePath.filePath, //相对路径
                    otherPath:filePath.filePath, //相对路径
                    fullPath:filePath.fullPath, //全路径
            }
            this.data.appraiseImagesList.push(attachment)
            this.setData({
                appraiseImagesList: this.data.appraiseImagesList
            })

        })
    
    },
    //删除图片
    deleteAppraisePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        this.data.appraiseImagesList.splice(currIndex, 1);
        this.setData({
            appraiseImagesList: this.data.appraiseImagesList,
        })
    },
    // 点击图片
    tapAppraiseBanner(e) {
        //let current = 'http:' + e.currentTarget.dataset.item
        let current = e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.appraiseImagesList) {
            //urls.push('http:' + item)
            urls.push(item)
        }

        wx.previewImage({
            current,
            urls,
        })
    },
    //接单
    tapReceiveOrder(e) {
        this.updateOrderStatus(this.data.orderStatus.TAKING_40)
        wx.showToast({
            title: '接单成功',
            duration: 1000
        })
    },
    tapRejectOrder(e) {
        this.updateOrderStatus(this.data.orderStatus.REJECT_30)
        wx.showToast({
            title: '已拒单',
            duration: 1000
        })
    },
    tapMakeOrder(e) {

        if (this.data.total == 0) {
            wx.showToast({
                title: '请填写描述',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.attachmentList.length == 0) {
            wx.showToast({
                title: '至少上传一张图片',
                icon: 'none',
                duration: 2000
            });
            return
        }
        let changeStatus = this.data.orderDetail.status === this.data.orderStatus.PAID_50 ?
            this.data.orderStatus.CHECKING_60
            : this.data.orderStatus.CHECK_FAIL_61
        this.updateOrderStatus(changeStatus,this.data.attachmentList,this.data.followDesc)
        wx.showToast({
            title: '提交成功',
            duration: 1000
        })
    },

     //一键呼叫
    freeTell(e){
        let content = e.currentTarget.dataset.content;
        wx.makePhoneCall({

            phoneNumber: content,
      
          })
    },
    //修改验收状态
    chooseRadioCheckstatus(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            currRadioCheckstatusIndex:index,
            isRadiochecked:true
        })
    },
    //修改二次验收状态
    confirmCheckStatusAgree(){
        if(this.data.currRadioCheckstatusIndex == 81){//仍然不通过 填写不通过原因 打开不通过弹窗页面填写不通过信息
            this.setData({
                currPicker:'nopass'
            })
        }else{
            this.updateOrderStatus(this.data.currRadioCheckstatusIndex)
            this.setData({
                shadeShowing: false
            })
        }
        
    },
    //获取失败原因
    getFailedReason(){     
        REST.get({
            url: API.getOrderUnAcceptInfo,
            data: {
                orderId: this.data.orderId
            },
            success: (data) => {
                this.setData({
                    failedReasonList: data
                })
            },
            failed: (resp) => {}
        })
    },
    //获取支付凭证
    tapLoadPayAttachment(e){
        let type = e.currentTarget.dataset.type;
        this.setData({
            currPicker:'pay',
            shadeShowing: true
        })
        let that = this
        REST.get({
            url: API.getPaymentVoucherInfo,
            data: {
                orderId: this.data.orderId,
            },
            success: (data) => {
                this.setData({
                    serialId:data.id,
                    orderId: data.orderId,
                    attachmentList:data.images
                })
                this.watchPayFollow()
            },
            failed: (resp) => {}
        })
    },
    // 上传支付凭证
    tapPayUpload(){
    
        //参数详见 :utils/upload.js 
        uploadFile('order',(filePath)=>{
            let attachment = {
                path: filePath.filePath, //相对路径
                otherPath:filePath.filePath, //相对路径
                fullPath:filePath.fullPath, //全路径
            }
            this.data.attachmentList.push(attachment)
            this.setData({
                attachmentList: this.data.attachmentList
            })
            this.watchPayFollow()

        })

    },
    watchPayFollow() {
        if (this.data.attachmentList.length == 0) {
            this.setData({
                canClick: false
            })
        } else {
            this.setData({
                canClick: true
            })
        }
    },
    //我已完成打款 点击事件
    tapPay(e){
        if (this.data.attachmentList.length == 0) {
            wx.showToast({
                title: '请上传支付凭证',
                icon: 'none',
                duration: 2000
            })
            return
        } 
        let that = this
        REST.post({
            url: API.uploadPayAttachment,
            data: {
                id:this.dataserialId || '',
                orderId: this.data.orderId,
                images: this.data.attachmentList,
            },
            success: (data) => {
                wx.showToast({
                    title: '支付凭证提交成功',
                    duration: 1000
                })
                this.setData({
                    shadeShowing: false,
                    attachmentList:[]
                })
            },
            failed: (resp) => {}
        })       
    },
    bindUpdatePriceInput(e){
        let actOrderMny = this.money(e.detail.value)
        this.setData({
            updateActOrderMny:actOrderMny,
        });
    },
    //修改价格弹窗
    tapUpdatePrice(e){
        this.setData({
            currPicker:'updatePrice',
            shadeShowing: true,
        })
    },
     /**
     * @method: 金额输入限制
     * @params: val接收number值
     */
    money(val) {
        let num = val.toString(); //先转换成字符串类型
        if (num.indexOf('.') == 0) { //第一位就是 .
        num = '0' + num
        }
        num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        if (num.indexOf(".") < 0 && num != "") {
        num = parseFloat(num);
        }
        return num
    },
    //修改价格确认
    tapUpdatePriceok(){
        if ( Number(this.data.updateActOrderMny) <= 0) {
            wx.showToast({
                title: '输入的金额不能小于0哦',
                icon: 'none',
                duration: 2000
            })
            return
        } 

        let that = this
        REST.put({
            url: API.updateOrderMny,
            data: {
                id: this.data.orderId,
                actOrderMny:this.data.updateActOrderMny
            },
            success: (data) => {
                that.getOrderDetail()
                this.setData({
                    shadeShowing: false,
                })
            },
            failed: (resp) => {}
        })
    },
    //评价图片预览
    tapEvaluateBanner(e){
        let current =  e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.evaluationInfo.images) {
            urls.push(item.fullPath)
        }

        wx.previewImage({
            current,
            urls,
        })
    }
})