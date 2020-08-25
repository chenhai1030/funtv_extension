function reinitIframe(height){
	let myIframe = document.getElementById("FuntvGalleryHelper")
	myIframe.height = height
	// console.info("h:", height)
}

function removeIframe(){
	let modalIframe = document.getElementById("FuntvModalIframe")
	if (modalIframe){
		document.documentElement.removeChild(modalIframe)
	}
	let myIframe = document.getElementById("FuntvGalleryHelper")
	if(myIframe){
		document.documentElement.removeChild(myIframe)
	}
}

function addModal(){
	let modalIframe = document.getElementById("FuntvModalIframe")
	if (!modalIframe){
		modalIframe = document.createElement("iframe")
		modalIframe.id = "FuntvModalIframe"
		modalIframe.src = chrome.extension.getURL('modal.html')
		modalIframe.classList.add("iframeModal")
		document.documentElement.appendChild(modalIframe)
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
		removeIframe()
	}

	window.addEventListener("message", function(e){
		console.info('rec ：', e.data);
		if (e.data){
			if(e.data.cmd == 'reinitIframe') {
				reinitIframe(e.data.data)
			}
			else if(e.data.cmd == 'removeIframe'){
				removeIframe()
			}
		}
	}, false);
}();

