
const mapItemStateOptionsToPage = item => {
		$('#conditions').append(
			`<button id=${item.id} class="conditionOption">${item.cleanliness}</button>`
			)
}



const mapGarageItemsToPage = data => {
	$('#garageItems').append(
		`
	<div class="garageItemCard">
		<p class="garageItemName garageDetail">${data.name}</p>
		<p class="garageItemReason garageDetail">${data.excuse}<p>
		<p class="garageItemCondition garageDetail">${data.item_state_id}</p>
		<button id="deleteBtn" class="deleteButton">Delete</button>
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

	fetch('/api/v1/items')
	.then(resp => resp.json())
	.then(returnValue => {
		fetchCondition(returnValue)
	})
	.catch(error => console.log(error))
}

$('.conditionOption').on('click', () => {
	console.log('hit')
})

$('#submitBtn').on('click', function(e) {
	console.log('hit', e)
})

$('#deleteBtn').on('click', function(e) {
	console.log('hit', e)
})


$(document).ready(() => {
	populateGarage()
})