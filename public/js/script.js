const formSubmit = document.querySelector('#formSubmit');
const message = document.querySelector('#formSubmitMsg');
const form = document.querySelector('#form');


if (formSubmit) {
    formSubmit.addEventListener('click', async (e) => {
        const messageText = document.querySelector('#message');
        e.preventDefault();
        const data = {
            'message': messageText.value
        }
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch('/message', options)
            .then(() => {
                messageText.value = '';
                message.innerHTML = 'Thank you for your message. We will review it and respond soon.'
            })
            .catch(e => {
                message.innerHTML = 'Something went wrong'
            })
    })
}
