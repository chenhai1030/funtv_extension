let imgarrs
let serverip = "http://172.17.3.201/"

function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    arr.push("q=" + data)
    return arr;
}

function close(){
    sendMsg("removeInjected", "")
}

function switchShow(){
    let imgDiv = document.getElementById("imgContainer")
    if(imgDiv.style.display == "none"){
        imgDiv.style.display = 'block'
        let imgCheight 
        let len = imgDiv.childNodes.length
        // console.info("imgs:", len)
        if (len > 6){
            imgCheight = "450px"
        }else if (len > 3){
            imgCheight = "320px"
        }else if (len >= 1){
            imgCheight = "190px"
        }else {
            imgCheight = "80px"
        }
        sendMsg("reinitIframe", imgCheight)
    }else{
        imgDiv.style.display = 'none'
        sendMsg("reinitIframe", "80px")
    }
}

function sendMsg(cmd, data){
    window.parent.postMessage({cmd: cmd, data: data}, '*');
}

function getItemNum(res){
    return res.total
}

function showPreview(e){
    let data = e.path[0].attributes[0].nodeValue
    sendMsg("preview", data)
}

function createImg(src, i){
    let imgDiv = document.getElementById("imgContainer")
    let img = document.createElement("img")
    img.src = src
    img.id = "img" + i
    img.style.width = "150px"
    img.style.height = "112px"
    if (i%2==0){
        img.style.marginLeft="5px"
    }else{
        img.style.marginRight="5px"
    }
    imgDiv.appendChild(img)
    document.getElementById(img.id).addEventListener("click", showPreview)
}

function prepareImg(num, resObj){
    let imgDiv = document.getElementById("imgContainer")
    let childs = imgDiv.childNodes
    for (let i=childs.length -1; i>=0; i--){
        imgDiv.removeChild(childs[i])
    }

    if (num >0){
        if (num >= 6){
            imgDiv.style.height = '350px'
            imgDiv.style.overflow = 'scroll'
        }
        for (let i=1; i<=6; i++){
            let imgSrc = serverip + resObj.data[i-1].imgUrl
            createImg(imgSrc, i)
        }
        if (num >= 7){
            let img = document.createElement("img")
            img.src = serverip + resObj.data[6].imgUrl
            img.id = "img7"
            img.style.marginRight="5px"
            img.style.width = "150px"
            img.style.height = "112px"
            imgDiv.appendChild(img)
        }
    }

    let len = imgDiv.childNodes.length
    if (len){
        sendMsg("reinitIframe", "450px")
    }
}

function checkInfo(){
    //enter pressed
    if (event.keyCode == 13) {
        let keyword=document.querySelector('[name="searchInput"]').value
        ajax({
            url: serverip + "/api/search",     //request path
            type: "GET",                       //request type
            data: keyword,                      //request param
            dataType: "json",
            success: function (response, xml) {
                // console.info("success!!")
                let resObj =  JSON.parse(response)
                // console.info(resObj)
                imgarrs = resObj.data
                let imgNums = getItemNum(resObj)
                prepareImg(imgNums, resObj)
            },
            fail: function (status) {
                console.info("failed!!")
            }
        })
    }
}

function waterfall(imgarrs){
    if (imgarrs.length > 7){
        for(let i=7; i< imgarrs.length; i++){
            let imgSrc = serverip + imgarrs[i].imgUrl
            createImg(imgSrc, i+1)
        }
        imgarrs.length = 0
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("switchShow").addEventListener("click", switchShow);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("close").addEventListener("click", close);
});

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('TitleField').addEventListener("keyup", checkInfo);
});

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('imgContainer').onscroll = function(){
        waterfall(imgarrs)
    }
});