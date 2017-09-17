
const mapItemStateOptionsToPage = item => {
		$('#conditions').append(
			`<button id=${item.id} class="conditionOption">${item.cleanliness}</button>`
			)
}

const mapGarageItemsToPage = data => {
	$('#tableCards').append(
		`
		<div id="item-${data.id}" class="card">
			<p id="garageItemId" class="description">${data.id}</p> 
			<p id="itemName" class="description">${data.name}</p>
			<p id="itemExcuse" class="description overflow">${data.excuse}<p>
			<p id="itemCondition" class="description">${data.item_state}</p>
			<button class="description button" id="deleteBtn">Delete</button>
		</div>
		`
		)
}

const printGarageItems = data => {

	console.log( $('#itemId').hasClass('up') )

	if( $('#itemId').hasClass('up') ) {
		data = data.sort((a,b) => {
			return a.id < b.id
		})
	} else {
		data = data.sort((a,b) => {
			return a.id > b.id
		})
	}

	data.forEach(item => mapGarageItemsToPage(item))
}

const populateGarage = () => {
	fetch('/api/v1/items/')
	.then(resp => resp.json())
	.then(returnValue => {
		$('#tableCards').empty()
		printGarageItems(returnValue.data)
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
	.then(returnedObj => {
		$('#newItem').empty()
		$('#newReason').empty()
		$('#tableCards').empty()
		printGarageItems(returnedObj.data)
	})
}

const deleteCard = id => {
	fetch('/api/v1/items/destroy', {
		method: "DELETE",
		body: JSON.stringify({ id }),
		headers: { "Content-Type":"application/json" }
	})
	.catch(error => {console.log(error)})
}




//------> ACTIONS <------//

$('#toggleDoor').on('click', () => {
	$('#closedDoor').toggleClass('door', 'doorAction')
})

$('#submitBtn').on('click', () => {
	const item = $('#newItem').val()
	const excuse = $('#newReason').val()
	const condition = $('#condition option:selected')[0].id

	postNewGarageItem({ name:item,excuse:excuse,item_state_id:condition })
})

$('#table').on('click', '#deleteBtn', function() {
	const id = $(this).parents('.card').attr('id')
	deleteCard(id)
	$(this).parents().remove('.card')
})

$('#itemId').on('click', function() {
	$('#itemId').toggleClass('up')
	
	const itemIdArray = $('[id="garageItemId"]')
	const somethingArray = []

	itemIdArray.each((i,item) => {
		const block = $(`[id="item-${item.innerText}"]`)

		const id = parseInt(block.find('#garageItemId').text())
		const name = block.find('#itemName').text()
		const excuse = block.find('#itemExcuse').text()
		const condition = block.find('#itemCondition').text()

		somethingArray.push({ id:id,name:name,excuse:excuse,item_state:condition })
	})

	$('#tableCards').empty()
	printGarageItems(somethingArray)
})


$(document).ready(() => {
	populateGarage()
})