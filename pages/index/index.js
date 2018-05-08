//index.js
const app = getApp()
Page({
  data: {
    "avatarUrl": "../image/2.jpg",//默认图片
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
    }
  },
  //选择图片
  select: function() {
      var that = this;
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                  avatarUrl: tempFilePaths,
                  'stv.offsetX': 0, //重置位置
                  'stv.offsetY': 0,
                  'stv.distance' :0,
                  'stv.scale': 1,
                })
              }
            })
    },
 //保存图片
  Save: function () {
     wx.saveImageToPhotosAlbum({
        fail(res) {
            console.log("124")
          }
       })
    },
  //触摸开始
  touchstartCallback: function(e) {
    // console.log('touchstartCallback');
    // console.log(e);
    if (e.touches.length === 1) { //touches触摸点的信息
      let {clientX, clientY} = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'stv.distance': distance,
        'stv.zoom': true, //缩放状态
      })
    }
  },
  //触摸移动中
  touchmoveCallback: function(e) {
    if (e.touches.length === 1) {
      //单指移动
      if (this.data.stv.zoom) {
        //缩放状态，不处理单指
        return ;
      }
      let {clientX, clientY} = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY- this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let {stv} = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });
    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;

      this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }

  },
 //触摸结束
  touchendCallback: function(e) {
    // console.log('touchendCallback');
    // console.log(e);
    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
    }
  },
})
