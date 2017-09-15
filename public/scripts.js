

const mapItemStateOptionsToPage = item => {
		$('#conditions').append(
			`<button id=${item.id} class="conditionOption">${item.cleanliness}</button>`
			)
}

const printItemsState = data => {
	data.map(i => {
		mapItemStateOptionsToPage(i)
	})
}

const populateConditions = () => {
	fetch('/api/v1/itemstate/')
	.then(resp => resp.json())
	.then(data => {
			printItemsState(data.conditions)
	})
}

const mapGarageItemsToPage = data => {
	$('#garageItems').append(
		`
	<div class="garageItemCard">
		<h3 class="garageItemName">${data.name}</h3>
		<p class="garageItemReason">${data.excuse}<p>
		<p class="garageItemCondition">${data.item_state_id}</p>
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

$('#submitBtn').on('click', () => {
	console.log('hit')
})


$(document).ready(() => {
	populateConditions()
	populateGarage()
})