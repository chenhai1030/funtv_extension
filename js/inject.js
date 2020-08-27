{
let pageMouseX, pageMouseY
let frameTop = 0
let frameLeft = 0


function handleDragStart (mouseX, mouseY) {
	// 得出鼠标在上层的位置
	pageMouseX = frameLeft + mouseX
	pageMouseY = frameTop + mouseY
  
	document.addEventListener('mouseup', handleDragEnd)
	document.addEventListener('mousemove', handlePageMousemove)
  }
  
  function handleDragEnd () {
	document.removeEventListener('mouseup', handleDragEnd)
	document.removeEventListener('mousemove', handlePageMousemove)
  }
  
  function handleFrameMousemove (offsetX, offsetY) {
	let myIframe = document.getElementById("FuntvGalleryHelper")
	frameTop += offsetY
	frameLeft += offsetX
	myIframe.style.top = frameTop + 'px'
	myIframe.style.left = frameLeft + 'px'
  
	// 更新鼠标在上层的位置，补上偏移
	pageMouseX += offsetX
	pageMouseY += offsetY
  }

  function handlePageMousemove (evt) {
	let myIframe = document.getElementById("FuntvGalleryHelper")
	frameTop += evt.clientX - pageMouseX
	frameLeft += evt.clientY - pageMouseY
	myIframe.style.top = frameTop + 'px'
	myIframe.style.left = frameLeft + 'px'
  
	// 新位置直接可以更新
	pageMouseX = evt.clientX
	pageMouseY = evt.clientY
  }

function reinitIframe(height){
	let myIframe = document.getElementById("FuntvGalleryHelper")
	myIframe.height = height
}

function removeInjected(){
	let modalDiv = document.getElementById("FuntvModalDiv")
	if (modalDiv){
		document.body.removeChild(modalDiv)
	}
	let myIframe = document.getElementById("FuntvGalleryHelper")
	if(myIframe){
		document.documentElement.removeChild(myIframe)
	}
}

function closeModal(){
	let modalDiv = document.getElementById("FuntvModalDiv")
	modalDiv.style.display = "none";
	modalDiv.style.zIndex = "-1"
}

function checkESC(){
	if (event.keyCode == 27) {
		closeModal()
	}
}

function addModal(){
	let modalDiv = document.getElementById("FuntvModalDiv")
	if (!modalDiv){
		modalDiv = document.createElement("div")
		modalDiv.id = "FuntvModalDiv"
		modalDiv.classList.add("FuntvModalDiv")
		modalDiv.tabIndex = "-1"
		modalDiv.addEventListener("keyup", checkESC)
		document.body.appendChild(modalDiv)
	}
	if (modalDiv){
		modalDiv.innerHTML='<span id="FuntvModalClose">×</span><img id="funtv-modal-content"><div id="funtv-caption"></div>'
		document.getElementById("FuntvModalClose").addEventListener("click", closeModal)
	}
}

function showPreview(data){
	let modal = document.getElementById('FuntvModalDiv');
	document.getElementById("funtv-modal-content").src = data
	document.getElementById("funtv-caption").innerHTML = "我是xx"
	
	if(modal){
		modal.style.display = "block"
		modal.style.zIndex = "999"
		modal.style.outline = "none"
		modal.focus()
	}
}

function getBase64Image(img){
	var canvas = document.createElement("canvas");
	canvas.width = img.width
	canvas.height = img.height
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height); 
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	// console.log(dataURL)
	return dataURL;
}

function exChangePic(data){
	var img = new Image();
	img.crossOrigin = "";
	img.src = data
	img.onload = function(){
		let base64 = getBase64Image(img)
		let iframes = document.getElementsByTagName("iframe")
		for (let i=0; i<iframes.length; i++){
			if (iframes[i].dataset.src == "/admin/refine_task"){
				var contentIframe = document.getElementsByTagName("iframe")[i] 
			}
		}
		let exDiv = contentIframe.contentWindow.document.getElementsByClassName("img-still mod-editpic")
		let mImg = exDiv[0].childNodes[2]
		// console.info(mImg)
		mImg.src = base64
	}
}

+function () {
	addModal()
	let myIframe = document.getElementById("FuntvGalleryHelper")
	if (!myIframe){
		myIframe = document.createElement("iframe")
		myIframe.id = "FuntvGalleryHelper"
		myIframe.scrolling = "auto"
		myIframe.src = chrome.extension.getURL ('helper.html')
		myIframe.classList.add("st-inspector")
		document.documentElement.appendChild(myIframe)
	}else{
		removeInjected()
		return
	}

	window.addEventListener("message", function(e){
		const data = e.data
		// console.info("cmd:", data.cmd)
		switch(data.cmd){
			case 'reinitIframe':
				reinitIframe(e.data.data)	
				break
			case 'removeInjected':
				removeInjected() 
				break
			case 'preview':
				showPreview(e.data.data)
				break
			case 'exchange':
				exChangePic(e.data.data)	
				break
			case 'SALADICT_DRAG_START':
				handleDragStart(data.mouseX, data.mouseY)
				break
			case 'SALADICT_DRAG_MOUSEMOVE':
				handleFrameMousemove(data.offsetX, data.offsetY)
				break
			case 'SALADICT_DRAG_END':
				handleDragEnd()
				break
		}
	}, false);
}();

}
