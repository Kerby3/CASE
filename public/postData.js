let postDataBtn = document.querySelector('.monitorButton');
let client = document.querySelector('.client').textContent;
let clientName = '';
let clientSurname = '';
let nameClientField = document.querySelector('.nameClient');
let surnameClientField = document.querySelector('.surnameClient');

postDataBtn.addEventListener('click', () => {
	for (let i = 9; i < client.length; i += 1) {
		clientName += client[i];
		if (client[i+1] == ' ') {
			break;
		}
	}
	for (let i = client.length-2; i >= 9; i -= 1) {
		clientSurname = client[i] + clientSurname;
		if (client[i-1] == ' ') {
			break;
		}
	}
	nameClientField.name = 'clientName';
	nameClientField.value = clientName;
	surnameClientField.name = 'clientSurname';
	surnameClientField.value = clientSurname;
});