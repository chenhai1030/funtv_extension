function reinitIframe(height){
	let myIframe = document.getElementById("FuntvGalleryHelper")
	myIframe.height = height
	// console.info("h:", height)
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
	console.info("close modal")
	let modalDiv = document.getElementById("FuntvModalDiv")
	modalDiv.style.display = "none";
}

function addModal(){
	let modalDiv = document.getElementById("FuntvModalDiv")
	if (!modalDiv){
		modalDiv = document.createElement("div")
		modalDiv.id = "FuntvModalDiv"
		modalDiv.classList.add("FuntvModalDiv")
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
	}

	window.addEventListener("message", function(e){
		console.info('rec ：', e.data.data);
		if (e.data){
			if(e.data.cmd == 'reinitIframe') {
				reinitIframe(e.data.data)
			}
			else if(e.data.cmd == 'removeInjected'){
				removeInjected()
			}
			else if(e.data.cmd == 'preview'){
				showPreview(e.data.data)
			}
		}
	}, false);
}();

