const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    num:0,
    homeData:{messageNum:0},
    sexArr:['请选择性别','男','女'],
    educationArr:['初中','中专','大专','高中','本科','研究生','博士','其他'],

  },
  onLoad() {
    that = this;
    that.initValidate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    Api.caregiverInfo().then(res=>{
      console.log(res);
      that.setData({
        userInfo:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })

  },
  initValidate() {
    let rules = {
      name: {
        required: true
      },
      pic: {
        required: true
      },
      cardNo: {
        required: true,
        idcard:true
      },
      cardPic: {
        required: true
      },
      phone: {
        required: true
      },

      sex: {
        required: true
      },
      education: {
        required: true
      },
      district: {
        required: true
      },
      address: {
        required: true
      },
      des: {
        required: true
      },
      certificates:{
        size: 1
      }
    }, messages = {
      name: {
        required: "请输入姓名"
      },
      pic: {
        required: "请选择头像"
      },
      cardNo: {
        required: "请输入正确的身份证号码",
        idcard:"请输入正确的身份证号码"
      },
      cardPic: {
        required: "请上传身份证照片"
      },
      phone: {
        required: "请输入正确的手机号"
      },

      sex: {
        required: "请选择性别"
      },
      education: {
        required: "请选择学历"
      },
      district: {
        required: "请选择省市区"
      },
      address: {
        required: "请输入详细地址"
      },
      des: {
        required: "请输入简介信息"
      },
      certificates:{
        size: "请至少上传一个个人证书"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  inputChange(e){
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]:e.detail.value
    })
  },
  pickerChange(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let userInfo = that.data.userInfo;
    userInfo[type] = e.detail.value;
    that.setData({
      userInfo:userInfo
    })
  },
  regionChange(e){
    console.log(e);
    let userInfo = that.data.userInfo;
    userInfo.province = e.detail.value[0];
    userInfo.city = e.detail.value[1];
    userInfo.district = e.detail.value[2];
    that.setData({
      userInfo:userInfo
    })
  },
  chooseAddress(){
    wx.chooseLocation({
      success(res){
        console.log(res);
        let userInfo = that.data.userInfo;
        userInfo.address = res.address;
        that.setData({
          userInfo:userInfo
        })
      },
      fail(err){
        console.log("err",err)
      }
    })
  },
  async getPhoneNumber(e){
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      let code = await Api.getCode();
      Api.getPhoneNumber({
        encryptedData: e.detail.encryptedData,
        code: code,
        iv: e.detail.iv
      }).then(res=>{
        console.log("success",res);
        that.setData({
          ['userInfo.phone']:res.data
        })
      },err=>{
        console.log("err",err);
      })
    }
  },
  showCardNo(e){
    console.log(e)
  },
  chooseAvatra(e){
    console.log(e);    
    Api.uploadFile(e.detail.avatarUrl,false).then(res=>{
      console.log(res);
      that.setData({
        ['userInfo.pic']:res.data,
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  addCertificate(){
    let index = that.data.userInfo.certificates.length;
    that.setData({
      modalcertificate:true,
      certificate:{index}
    })
  },
  editCertificate(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let userInfo = that.data.userInfo;
    let certificate = userInfo.certificates[index];
    that.setData({
      certificate:certificate,
      modalcertificate:true
    })
  },
  removeCertificate(e){
    let index = e.currentTarget.dataset.index;
    let userInfo = that.data.userInfo;
    let certificates = userInfo.certificates;
    certificates.splice(index,1);
    that.setData({
      userInfo:userInfo
    })
  },
  submitCertificate(e){
    console.log(e)
    let {index,title,src} = e.detail.value;
    console.log({index,title,src});
    if(!title) return that.showTips("请输入证书名称");
    if(!src) return that.showTips("请上传证书照片");
    let userInfo = that.data.userInfo;
    userInfo.certificates[index] = {title,src};
    that.setData({
      userInfo:userInfo,
      certificate:{},
      modalcertificate:false
    })
  },
  addPic(e){
    console.log(e)
    that.uploadPic(1).then(res=>{
      Api.uploadFile(res[0].tempFilePath,false).then(res=>{
        console.log("endupload",res);
        that.setData({
          [e.currentTarget.dataset.target]:res.data
        })
      },err=>{
        that.showTips(err.msg);
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    Api.caregiverUpdate(data).then(res=>{
      console.log(res);
      that.showTips("信息更新成功","success");
      setTimeout(() => {
        wx.navigateBack()
      }, 1500);
    },err=>{
      that.showTips(err.msg);
    })
  }
})