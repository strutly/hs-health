const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {   
    lists:[],
    month:Util.formatTime(new Date(),'yyyy-MM')
  },
  onLoad(options) {
    that = this;
  },
  onReady() {
    that.getList(Util.formatTime(new Date(),'yyyy-MM-dd'));
  },
  getList(day){
    Api.caregiverCalendar({startDate:day}).then(res=>{
      that.setData({
        lists:res.data
      })
    },err=>{
      that.showTips(err.msg);
    });  
  },
  onShow() {

  },
  showDay(e){
    console.log(e);
    let dataset = e.currentTarget.dataset;
    if(dataset.appointments>0&&dataset.records>0){
      that.setData({
        modalJump:true,
        day:dataset.day
      })
    }else if(dataset.appointments>0){
      wx.navigateTo({
        url: '/pages/appointment/list?appointmentTime='+dataset.day,
      })
    }else if(dataset.records>0){
      wx.navigateTo({
        url: '/pages/task/list?orderTime='+dataset.day,
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '当日无预约或服务',
      })
    }
  },
  monthChange(e){
    let month = that.data.month;
    let date = new Date(month);
    let m = date.getMonth();
    let add = e.currentTarget.dataset.add;
    date.setMonth(m + parseInt(add));
    that.setData({
      month:Util.formatTime(date,'yyyy-MM')
    })
    that.getList(Util.formatTime(date,'yyyy-MM-dd'));
  },
})