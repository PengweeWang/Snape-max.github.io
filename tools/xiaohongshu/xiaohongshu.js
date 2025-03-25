api = "https://api.qiumo.fun/xiaohongshu/image/?url="

var picarea = document.getElementById("pic");
var result = document.getElementById("result");
var description = document.getElementById("description");
var info = document.getElementById("info");

var ci = "https://ci.xiaohongshu.com/";
var bd = "https://sns-img-bd.xhscdn.com/"

var hw = "https://sns-img-hw.xhscdn.com/";
var qc = "https://sns-img-qc.xhscdn.com/";

var rawformat = "?imageView2/2/w/10000/format/jpg";
var webformat = "?imageView2/2/w/120/format/jpg";





async function Parser(link) {
    result.style.display = "none";
    info.innerHTML = `<h2>正在解析...</h2>`;
    const url = `${api}${link}`;
    // console.log(url);
    // 返回一个Promise，以便外部可以处理解析后的数据
    try {
    const response = await fetch(url);
    if (!response.ok) {
      info.innerHTML = `<h2>网络错误</h2>`;
      throw new Error(`HTTP 错误：${response.status}`);
    }
    const data = await response.json();
    // 确保数据中有images属性再返回
    if (data && data.images_traceId) {
      info.innerHTML = "";
      result.style.display = "block";
      imgHtml = "";
      for (let i = 0; i < data.images_traceId.length; i++) {
        // imgHtml += `<a href='${data.images[i]}' download>图片${i+1}, 点击下载</a>`;
        imgHtml +=
          `<a href='${ci + data.images_traceId[i] + rawformat}' target='_blank'><img src='${ci + data.images_traceId[i] + webformat}' href='${data.images_traceId[i]}'></a>`;
      }

      picarea.innerHTML = imgHtml;
      description.innerHTML = `<h2>文案</h2><p>${data.description}</p>`;


    } else {
      info.innerHTML = `<h2>未找到图片</h2>`;
      throw new Error('No images found in the API response');
    }
  } catch (error) {
    info.innerHTML = `<h2>解析失败</h2>`;
    console.error('There was an error fetching the data:', error);
    throw error; // 抛出错误以在外部捕获
  }
}


document.getElementById("btn").addEventListener('click', () => {
    var text = document.getElementById("data").value;
    
    var url = text.match(/(https?:\/\/|ftp:\/\/)[^\"'\s]+/g);
    // console.log(url);
    // console.log(encodeURIComponent(url));
    if (url){
        Parser(encodeURIComponent(url));
    } else {
        info.style.display = "none";
    }

  });

