let institutionSelect = document.querySelector('.institutionSelect');

institutionSelect.addEventListener('change', () => {
	let reqReadyStateChange = () => {
	    if (request.readyState == 4) {
	        let status = request.status;
	        if (status == 200) {
	            console.log('OK');
	        }
	    }
	}
	let body = `institution=${institutionSelect.options[institutionSelect.selectedIndex].value}`;
	console.log(body);
	let request = new XMLHttpRequest();
	request.open("POST", '/');
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = reqReadyStateChange;
	request.send(body);
});

/*institutionSelect.addEventListener('onclick', () => {
	console.log('OK');
})*/

window.addEventListener('load', () => {
	let reqReadyStateChange = () => {
	    if (request.readyState == 4) {
	        let status = request.status;
	        if (status == 200) {
	            console.log('OK');
	        }
	    }
	}
	let body = `institution=${institutionSelect.options[institutionSelect.selectedIndex].value}`;
	//console.log(body);
	let request = new XMLHttpRequest();
	request.open("POST", '/', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = reqReadyStateChange;
	request.send(body);
});