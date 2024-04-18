

function addElementToList(elementName, timeStamp) {
    var list = document.getElementById("ss_elem_list");
    var listItem = document.createElement("li");
    listItem.timeStamp = timeStamp;
    listItem.setAttribute("role", "option");
    listItem.textContent = "Object: " + elementName + ", detected at: " + timeStamp + " s";
    list.appendChild(listItem);
}

addElementToList("Pedestrian", "50.21"); 
addElementToList("Pedestrian", "50.21"); 
addElementToList("Pedestrian", "50.21"); 
addElementToList("Vehicle", "50.21"); 
addElementToList("Vehicle", "50.21"); 
addElementToList("Pedestrian", "50.21"); 
addElementToList("Pedestrian", "50.21"); 
addElementToList("Pedestrian", "50.21"); 
addElementToList("Vehicle", "50.21"); 



