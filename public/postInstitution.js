let institutionBtn = document.querySelector('.avgSalaryInstitutionButton');
let institutionSelect = document.querySelector('.institutionSelect');

institutionBtn.addEventListener('click', () => {
	console.log('click')
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
	request.open("POST", 'avgSalaryInstitution');
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = reqReadyStateChange;
	request.send(body);
});

/*institutionSelect.addEventListener('onclick', () => {
	console.log('OK');
})*/

/*window.addEventListener('load', () => {
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
});*/