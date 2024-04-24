const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    num:0,
    homeData:{messageNum:0},

  },
  onLoad() {
    that = this;
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

  statusChange(e){
    let userInfo = that.data.userInfo;
    Api.caregiverOrderStatus().then(res=>{
      that.showTips("操作成功","success");
      that.setData({
        userInfo:res.data
      })
    },err=>{
      that.setData({
        userInfo:userInfo
      })
      that.showTips(err.msg);
    });    
  }
})