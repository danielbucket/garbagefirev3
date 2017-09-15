
const mapItemStateOptionsToPage = item => {
		$('#conditions').append(
			`<button id=${item.id} class="conditionOption">${item.cleanliness}</button>`
			)
}

const mapGarageItemsToPage = data => {
	$('#table').append(
		`
		<div class="card">
			<p class="description">${data.id}</p> 
			<p class="description">${data.name}</p>
			<p class="description">${data.excuse}<p>
			<p class="description">${data.item_state_id}</p>
			<button class="description button" id="deleteBtn">Delete</button>
		</div>
		`
		)
}

const printGarageItems = data => {
	mapGarageItemsToPage(data)
}

const fetchCondition = item => {
	item.data.forEach(card => {
		const id = card.item_state_id;

		fetch(`/api/v1/itemstate/${id}`)
		.then(resp => resp.json())
		.then(list => {
			printGarageItems(
				Object.assign(card, {item_state_id:list.data[0].cleanliness})
				)
		})
		.catch(error => console.log(error))
	})
}

const populateGarage = () => {
	fetch('/api/v1/items/')
	.then(resp => resp.json())
	.then(returnValue => {
		fetchCondition(returnValue)
	})
	.catch(error => console.log(error))
}

const postNewGarageItem = newObj => {
	fetch('/api/v1/items/', {
		method: "POST",
		body: JSON.stringify(newObj),
		headers: { "Content-Type": "application/json"}
	})
	.then(resp => resp.json(resp))
	.then(data => {
		$('#table').empty()
		populateGarage()
	})
}

$('#toggleDoor').on('click', () => {
	$('#garage').toggleClass('hidden')
	$('#closedDoor').toggleClass('closeDoor')
})

$('#submitBtn').on('click', () => {
	const item = $('#newItem').val()
	const reason = $('#newReason').val()
	const condition = $('#condition option:selected')[0].id

	postNewGarageItem({ name:item, excuse:reason, item_state_id:condition })
})

$('#deleteBtn').on('click', function(e) {
	console.log('hit', e)
})


$(document).ready(() => {
	populateGarage()
})