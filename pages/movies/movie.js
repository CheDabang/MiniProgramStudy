let app = getApp(); // 这里获取根目录下小程序的实例
Page({
    data: {
        containerShow: true,
    },
    onLoad: function () {
        let inTheatersUrl = app.globalData.doubanBase +
        "/v2/movie/in_theaters" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    },
    // 向豆瓣服务器请求数据
    getMovieListData: function (url, settedKey, categoryTitle) {
        console.log(url);
        var that = this;
        wx.request({
          url: url,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "json"
          },
          success: function (res) {
            that.processDoubanData(res.data, settedKey, categoryTitle)
          },
          fail: function (error) {
            // fail
            console.log(error)
          }
        })
      },
      processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
          var subject = moviesDouban.subjects[idx];
          var title = subject.title;
          if (title.length >= 6) {
            title = title.substring(0, 6) + "...";
          }
          // [1,1,1,1,1] [1,1,1,0,0]
          var temp = {
            stars: util.convertToStarsArray(subject.rating.stars),
            title: title,
            average: subject.rating.average,
            coverageUrl: subject.images.large,
            movieId: subject.id
          }
          movies.push(temp)
        }
        var readyData = {};
        readyData[settedKey] = {
          categoryTitle: categoryTitle,
          movies: movies
        }
        this.setData(readyData);
      }
})