const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    consumer:{}
  },
  onLoad(options) {
    that = this;
  },
  onReady() {
    Api.consumerDetail({id:that.data.options.id}).then(res=>{
      that.setData({
        consumer:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  location(e){
    let dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.openLocation({
      longitude:parseFloat(dataset.longitude),
      latitude:parseFloat(dataset.latitude),
      name:"客户位置",
      address:dataset.address
    })
  },
  submit(e){
    console.log(e);
    Api.consumerUpdate(e.detail.value).then(res=>{
      console.log(res);
      that.showTips("评论成功","success");
    },err=>{
      that.showTips(err.msg);
    })
  }
})