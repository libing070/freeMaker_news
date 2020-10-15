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
            undo: '制作',
            done: '制作'
        }, {
            undo: '待验收',
            done: '验收',
            stop:'验收不通过'
        }, {
            undo: '完成',
            done: '完成'
        }, {
            undo: '评价',//为了适应显示，唯一一组违反语义的值
            done: '待评价'//为了适应显示，唯一一组违反语义的值
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

        appraiseChildsStarSelNum1: 0, //结果打分点亮数

        appraiseChildsStarSelNum2: 0 ,//过程打分点亮数

        appraiseChildsStarSelNum3: 0 ,//推荐打分点亮数

        appraisemarkList:[
        ],

        appraiseImagesList: [], //评价图片
        appraiseTotal:0,

        currRadioCheckstatusIndex:'', //1 验收通过 ，2 验收不通过
        isRadiochecked:false
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
                        console.log("初始化评价技能", res)
                    }
                })
            }
        }
    },
    // 评价提交
    tapshadeAppraiseSubmit() {
        if (this.data.total == 0) {
            wx.showToast({
                title: '请填您的意见或建议',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.appraiseImagesList.length == 0) {
            wx.showToast({
                title: '至少上传一张图片',
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

        // let imageList = []
        // this.data.appraiseImagesList.forEach(item => {
        //     imageList.push({
        //         name: item.substr(item.lastIndexOf("/") + 1),
        //         path: item,
        //         otherPath: item
        //     })
        // })

        REST.post({
            url: API.publishEvaluation,
            data: {
                orderId: this.data.orderId,
                totalScore: this.data.appraiseStarSelNum,
                resultScore: this.data.appraiseChildsStarSelNum1,
                processScore: this.data.appraiseChildsStarSelNum2,
                recommendScore: this.data.appraiseChildsStarSelNum3,
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
                console.log("初始化评价技能", res)
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
        console.log(currIndex);
        this.data.attachmentList.splice(currIndex, 1);
        this.setData({
            attachmentList: this.data.attachmentList,
        })
        this.watchOperation()
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
                console.log(res);
            }
        })
    },
    //评价使用
    watchOperation() {
        if (this.data.total == 0 || this.data.appraiseImagesList.length == 0) {
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
                console.log("支付完成，调用订单状态改变接口")
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
    //验收不通过提交时间
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
    
        this.updateOrderStatus(this.data.orderStatus.CHECK_FAIL_70,this.data.attachmentList,this.data.followDesc)
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
                console.log("初始化订单详情完成", res)
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
                    this.setData({
                        evaluationInfo: res 
                    });
                }


            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化订单详情完成", res)
            }
        })

    },
    //复制汇款账号
    copyBankAccount(e) {
        wx.setClipboardData({
            data: '110941401110301',
            success(res) {
                console.log(res);
            }
        })
    },
    //复制微信号
    copyWeChat(e) {
        wx.setClipboardData({
            data: 'HowWork001',
            success(res) {
                console.log(res);
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
            appraiseMsg:appraiseStarSelNum == 1 ? '非常差' :appraiseStarSelNum == 2 ? '差' :appraiseStarSelNum == 3 ? '一般' :appraiseStarSelNum == 4 ? '满意' :'超级棒',
            appraiseChildsStarSelNum1:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum1,
            appraiseChildsStarSelNum2:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum2,
            appraiseChildsStarSelNum3:appraiseStarSelNum == 5 ? 5 : this.data.appraiseChildsStarSelNum3,
        })
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
        let summarize = this.deleteHtmlTag(e.detail.html);
        if (summarize.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: summarize.length,
            appraiseSummarize: e.detail.html
        });
        this.watchOperation()
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

            this.watchOperation()
        })
        // wx.chooseImage({
        //     count: 8 - this.data.appraiseImagesList.length,
        //     sizeType: ['compressed'],
        //     success: (res) => {
        //         this.setData({
        //             appraiseImagesList: this.data.appraiseImagesList.concat(res.tempFilePaths)
        //         });
        //         this.watchOperation()
        //     }
        // });
    },
    //删除图片
    deleteAppraisePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        console.log(currIndex);
        this.data.appraiseImagesList.splice(currIndex, 1);
        this.setData({
            appraiseImagesList: this.data.appraiseImagesList,
        })
        //this.watchOperation()
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
                                this.data.orderStatus.CHECKING_60:this.data.orderStatus.CHECK_FAIL_61
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
        this.updateOrderStatus(this.data.currRadioCheckstatusIndex)
        this.setData({
            shadeShowing: false
        })
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
    }
})