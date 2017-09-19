
const mapItemStateOptionsToPage = item => {
		$('#conditions').append(
			`<button id=${item.id} class="conditionOption">${item.cleanliness}</button>`
			)
}

const mapGarageItemsToPage = data => {
	$('#tableCards').append(
		`
		<div id="item-${data.id}" class="card">
			<p id="garageItemId" class="dataField description">${data.id}</p> 
			<p id="itemName" class="dataField description">${data.name}</p>
			<p id="itemExcuse" class="dataField description overflow">${data.excuse}<p>
			<p id="itemCondition" class="dataField description">${data.item_state}</p>
			<button class="description button" id="deleteBtn">Delete</button>
		</div>
		`
		)
}

const quantify = data => {
	return	 quantities = data.reduce((newObj, curVal) => {
		Object.keys(newObj).forEach(i => {
			Object.keys(curVal).forEach(j => {
				if(i === curVal[j]) {	newObj[i]++ }
			})
		})
		return newObj
	},{ itemsCount:data.length, sparkling:0, dusty:0, rancid:0 })
}

const printQuantities = quantityObj => {
	$('#itemsCountNum')[0].innerText = quantityObj.itemsCount
	$('#sparklyCountNum')[0].innerText = quantityObj.sparkling
	$('#dustyCountNum')[0].innerText = quantityObj.dusty
	$('#rancidCountNum')[0].innerText = quantityObj.rancid
}

const printGarageItems = (data, sortOptions) => {
	printQuantities(quantify(data))

	if(!sortOptions) {
		sortOptions = { toSortBy:'itemId', sort:'id' }
	}

	let sortCondition = sortOptions.sort

	if( $(`#${sortOptions.toSortBy}`).hasClass('up') ) {
		data = data.sort((a,b) => {
			return a[sortCondition] < b[sortCondition]
		})
	} else {
		data = data.sort((a,b) => {
			return a[sortCondition] > b[sortCondition]
		})
	}

	data.forEach(item => mapGarageItemsToPage(item))
}

const populateGarage = () => {
	fetch('/api/v1/items')
	.then(resp => resp.json())
	.then(returnValue => {
		$('#tableCards').empty()
		printGarageItems(returnValue.data)
	})
	.catch(error => console.log(error))
}

const postNewGarageItem = newObj => {
	fetch('/api/v1/items', {
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
	const newId = id.slice(5,7)

	fetch('/api/v1/items/destroy', {
		method: "DELETE",
		body: JSON.stringify({ newId:newId }),
		headers: { "Content-Type":"application/json" }
	})
	.then(resp => resp.json())
	.then(returnedObj => {
		$('#newItem').empty()
		$('#newReason').empty()
		$('#tableCards').empty()

		printGarageItems(returnedObj.data)
	})
	.catch(error => console.log(error) )
}

const repackageToSort = toSortBy => {
	const itemIdArray = $('[id="garageItemId"]')
	const somethingArray = []

	itemIdArray.each((i,item) => {
		const block = $(`[id="item-${item.innerText}"]`)
		const id = parseInt(block.find('#garageItemId').text())
		const name = block.find('#itemName').text()
		const excuse = block.find('#itemExcuse').text()
		const condition = block.find('#itemCondition').text()

		somethingArray.push({ id:id,
																								name:name,
																								excuse:excuse,
																								item_state:condition })

		})
			$('#tableCards').empty()
			printGarageItems(somethingArray, toSortBy)
	}


const updateCard = originID => {
	const block = $(`#${originID}`)
	const id = parseInt(originID.slice(5,7))
	const name = block.find('#itemName')[0].innerText
	const excuse = block.find('#itemExcuse')[0].innerText
	const item_state = block.find('#itemCondition')[0].innerText	

	fetch(`/api/v1/cleanliness/${item_state}`)
	.then(resp => resp.json())
	.then(cleanlinessID => {

		const PUTnewData = {
			id:id,
			replaceWith: {
				name:name,
				excuse:excuse,
				item_state:item_state,
				item_state_id: cleanlinessID.id[0].id
			}
		}

		fetch('/api/v1/items', {
			method: "PUT",
			body: JSON.stringify(PUTnewData),
			headers: { "Content-Type":"application/json" }
		})
		.then(resp => resp.json())
		.then(data => {
			$('#tableCards').empty()
			printGarageItems(data.data)
		})
		.catch(error => console.log(error))
	})
	.catch(error => console.log(error))
}

const submitBtn = () => {
	const item = $('#newItem').val()
	const excuse = $('#newReason').val()
	const condition = $('#condition option:selected')[0].id

	$('#newItem').val('')
	$('#newReason').val('')

	postNewGarageItem({ name:item,
																					excuse:excuse,
																					item_state_id:condition })
}

//------> ACTIONS <------//

// $('#closedDoor').on('click', function(){
// 	$(this).addClass('openDoor')
// })

$('#table').on('click', '#itemName', function() {
	$(this).attr('contenteditable', 'true');
	$(this).siblings('#deleteBtn')[0].innerText = 'Update';
	$(this).siblings('#deleteBtn').addClass('update');
})

$('#table').on('click', '#itemExcuse', function() {
	$(this).attr('contenteditable', 'true')
	$(this).siblings('#deleteBtn')[0].innerText = 'Update';
	$(this).siblings('#deleteBtn').addClass('update')
})

$('#toggleDoor').on('click', function(){
	$(this).toggleClass('openDoor')
})

$('#submitBtn').on('click', () => {
	submitBtn()
})

$('#table').on('click', '#deleteBtn', function() {
	const id = $(this).parents('.card').attr('id')
	const cardToUpdate = $(this).parents('.card')[0]

	if($(this).hasClass('update')) {
		return updateCard(id)
	}

		deleteCard(id)
	$(this).parents().remove('.card')
})

$('#itemTitle').on('click', function() {
	$('#itemTitle').toggleClass('up')
	const toSortBy = $(this)[0].id

	repackageToSort({ toSortBy:toSortBy, sort:'name' })
})

$('#itemId').on('click', function() {
	$('#itemId').toggleClass('up')
	const toSortBy = $(this)[0].id

	repackageToSort({ toSortBy:toSortBy, sort:'id' })
})

$('#itemReason').on('click', function() {
	$('#itemReason').toggleClass('up')
	const toSortBy = $(this)[0].id

	repackageToSort({ toSortBy:toSortBy, sort:'excuse' })
})

$('#itemCondition').on('click', function() {
	$('#itemCondtion').toggleClass('up')
	const toSortBy = $(this)[0].id

	repackageToSort({ toSortBy:toSortBy, sort:'item_state' })
})

$(document).ready(() => {
	populateGarage()
})