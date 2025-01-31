let foodTypeQuantities = [];
let selectedFoods = [];
let foodTypes = ["dairy", "pantry", "meat and seafood", "produce", "bakery", "frozen"];

/*  Called when user clicks "return to main menu" button, cleans up all created HTML elements */
function returnToMainMenu(){
  innerFridgeMenu.innerHTML = '';
  fridgeInventory.innerHTML = "";
  userSelection.innerHTML = "";
  selectedFoods.splice(0, selectedFoods.length);
}

/*  Creates second menu of available fridges, wraps around to next row if more fridges are added */
function listFridges(){
  document.getElementById("openFridge").hidden = true;
	let list = document.getElementById("availableFridges");

	for(let fr of fridges){
		let btn = document.createElement('button');
		btn.className = "button-fridge";

		let img = document.createElement('img');
		img.src    = "provided_code/images/fridge.svg";
		img.height = 120;
		img.width  = 100;
		btn.appendChild(img);

		btn.appendChild(document.createElement("br"));
		btn.appendChild(document.createTextNode(fr.name));
		btn.appendChild(document.createElement("br"));
		btn.appendChild(document.createTextNode(fr.address.street) );
		btn.appendChild(document.createElement("br"));
		btn.appendChild(document.createTextNode(fr.contact_phone) );

		btn.fridge = fr;
		btn.addEventListener('click', clickOnFridge);

		list.appendChild(btn);
	}
}

/*  Performs necessary setup for selected fridge--loads all the data from the provided data file, required creates menus */
function clickOnFridge(){
  selectedFridge = this.fridge;
  document.getElementById("displayFridges").hidden = true;
  document.getElementById("openFridge").hidden = false;
  document.getElementById("fridgeHeader").innerHTML = "Items in the " + selectedFridge.name;

  writeFridgeInfo();
  writeFridgeCapacity();
  writeInnerFridgeMenu();
  writeFridgeInventory("none");
}

/*  Writes down necessary information for fridge (name, address, contact phone number) */
function writeFridgeInfo(){
  let e = document.createElement('h2');
  e.className = "fridgeInfoLine1";
	e.appendChild(document.createTextNode(selectedFridge.name));
	innerFridgeMenu.appendChild(e);

	e = document.createElement('p');
  e.className = "fridgeInfoLine2";
	e.appendChild(document.createTextNode(selectedFridge.address.street));
	innerFridgeMenu.appendChild(e);

	e = document.createElement('p');
  e.className = "fridgeInfoLine2";
	e.appendChild(document.createTextNode(selectedFridge.contact_phone));
	innerFridgeMenu.appendChild(e);

	innerFridgeMenu.appendChild(document.createElement("br"));

  e = document.createElement('h2');
  e.className = "fridgeInfoLine1";
  e.appendChild(document.createTextNode("You have picked up the following items: "));
  userSelection.appendChild(e);

}

/*  Filters fridge inventory by selected food type */
function clickOnFoodType(){
	let i = foodTypes.indexOf(this.type);
	if(foodTypeQuantities[i] == 0){
		return;
	}
	writeFridgeInventory(this.type);
}

/*  Creates two div elements that represent the capacity bar of the fridge */
function writeFridgeCapacity(){
  let capacityBarWidth = 200;

  let e = document.createElement('div');
  e.className = "capacityOuter";
  e.style.width = capacityBarWidth + "px";
  innerFridgeMenu.appendChild(e);

  e = document.createElement('div');
  e.className = "capacityInner";
  e.style.width = ((capacityBarWidth * selectedFridge.capacity) / 100) + "px";
  e.appendChild(document.createTextNode(selectedFridge.capacity + "%"));
	innerFridgeMenu.appendChild(e);

}

/* Creates food type sorting menu on the leftmost panel */
function writeInnerFridgeMenu(){
  let itemsArray = Object.keys(selectedFridge.items);
  for (let i = 0; i < foodTypes.length; i++) {
		foodTypeQuantities[i] = 0;
		for (let item of itemsArray) {
			if(selectedFridge.items[item].type === foodTypes[i] ) {
				foodTypeQuantities[i] += selectedFridge.items[item].quantity;
			}
		}
	}

  for (let i = 0; i < foodTypes.length; i++) {
		e = document.createElement('p');
		e.className = "foodTypes";
		e.type = foodTypes[i];
		e.innerHTML = foodTypes[i] + " (" + foodTypeQuantities[i] + ")";
		e.addEventListener('click', clickOnFoodType);
		innerFridgeMenu.appendChild(e);
	}

}

/*  Writes the fridge inventory on the middle panel */
function writeFridgeInventory(selectedFoodType){
  fridgeInventory.innerHTML = "";

  let itemsArray = Object.keys(selectedFridge.items);

  let table = document.createElement('table');
  table.className = "fridgeInventoryTable";
  for(let item of itemsArray){
    if((selectedFoodType == "none") || (selectedFoodType == selectedFridge.items[item].type)){
      // Column 1: Populates first column with images
      let row = document.createElement("tr");
      let data = document.createElement("td");
      let img = document.createElement('img');
      img.src = "provided_code/" + selectedFridge.items[item].img;
      img.height = 80;
      img.width = 80;
      img.className = "fridgeInventoryImage";
      data.appendChild(img);
      row.appendChild(data);
      row.className = "fridgeInventoryRow";
      table.appendChild(row);

      // Column 2: Populates second column with name and quantity
      data = document.createElement("td");
      data.className = "fridgeInventoryText";
      let text = selectedFridge.items[item].name;
      data.appendChild(document.createTextNode(text));
      data.appendChild(document.createElement("br"));
      text = "Quantity: " + selectedFridge.items[item].quantity;
      data.appendChild(document.createTextNode(text));
      data.appendChild(document.createElement("br"));
      text = "Pickup item: ";
      data.appendChild(document.createTextNode(text));
      row.appendChild(data);
      row.className = "fridgeInventoryRow";
      table.appendChild(row);

      //Column 3: Populate with + button
      data = document.createElement("td");
      data.appendChild(document.createElement("br"))
      let plusButton = document.createElement("button");
      plusButton.className = "fridgeInventoryButton";
      plusButton.item = selectedFridge.items[item];
      plusButton.appendChild(document.createTextNode("+"));
      plusButton.addEventListener("click", function(){
        clickPlusButton(plusButton.item);
        counter = document.getElementById(selectedFridge.items[item].name + " count");
        if(counter.innerHTML < selectedFridge.items[item].quantity){
          counter.innerHTML++;
        }
      });
      data.appendChild(plusButton);
      row.appendChild(data);
      table.appendChild(row);

      //Column 4: Populate with incrementing counter
      data = document.createElement("td");
      let div = document.createElement("div");
      div.className = "fridgeInventoryQuantity";
      div.id = selectedFridge.items[item].name + " count";
      text = "0";
      div.appendChild(document.createTextNode(text));
      data.appendChild(document.createElement("br"));
      data.appendChild(div);
      row.appendChild(data);
      table.appendChild(row);

      //Column 5: Populate with - button
      data = document.createElement("td");
      data.appendChild(document.createElement("br"))
      let minusButton = document.createElement("button");
      minusButton.className = "fridgeInventoryButton";
      minusButton.item = selectedFridge.items[item];
      minusButton.appendChild(document.createTextNode("-"));
      minusButton.addEventListener("click", function(){
        clickMinusButton(plusButton.item);
        counter = document.getElementById(selectedFridge.items[item].name + " count");
        if(counter.innerHTML > 0){
          counter.innerHTML--;
        }
      });
      data.appendChild(minusButton);
      row.appendChild(data);
      table.appendChild(row);
    }
  }
  fridgeInventory.appendChild(table);
}

/*  Performs the necessary changes to the selectedFoods array, which stores what foods the user has selected and in what
    quantity, as well as updates the HTML on the rightmost menu to reflect the changes (item/quantity added) */
function clickPlusButton(itemSelected){
  /*Three cases:
    1. Food found in selectedFoods array, with inventory available
    2. Food not found in selectedFoods, and must be added
    3. Food found in selectedFoods array, but quantity greater than available already selected (click can be ignored))*/
  let savedIndex = -1;
  for(let i = 0; i < selectedFoods.length; i++){
    if(selectedFoods[i].name === itemSelected.name){
      savedIndex = i;
      if(itemSelected.quantity > selectedFoods[i].count){
        //Case 1: Food found in selectedFoods array, with inventory available
				selectedFoods[i].count++;
        let fixedLine = document.getElementById(itemSelected.name);
        document.getElementById(itemSelected.name).innerHTML = itemSelected.name + " x " + selectedFoods[i].count;
			}
      break;
    }
  }
  if(savedIndex == -1){
    // Case 3: Food not found in selectedFoods, and must be added
    selectedFoods.push({name: itemSelected.name, count: 1});
    let p = document.createElement("p");
    p.id = itemSelected.name;
    p.appendChild(document.createTextNode(itemSelected.name + " x 1"));
    userSelection.appendChild(p);
  }
}

/*  Performs the necessary changes to the selectedFoods array, which stores what foods the user has selected and in what
    quantity, as well as updates the HTML on the rightmost menu to reflect the changes (item/quantity removed) */
function clickMinusButton(itemSelected){
  /*Three cases:
    1. Food found in selectedFoods array in quantity greater than 0, and can have count decremented without issue
    2. Food found in selectedFoods array in quantity 1, and must be removed from array
    3. Food not found in selectedFoods (does not need unique interaction and click can be ignored)*/

  let savedIndex = -1;
  for(let i = 0; i < selectedFoods.length; i++){
    if(selectedFoods[i].name === itemSelected.name){
      if(selectedFoods[i].count > 1){
        // Case 1: Food will remain in selectedFoods but count will be decremented
        selectedFoods[i].count--;
        savedIndex = i;
        document.getElementById(itemSelected.name).innerHTML = itemSelected.name + " x " + selectedFoods[i].count;
      }else{
        // Case 2: Food must be removed from selectedFoods array
        selectedFoods.splice(i, 1);
        document.getElementById(itemSelected.name).innerHTML = "";
        document.getElementById(itemSelected.name).remove();
      }
      break;
    }
  }
}
