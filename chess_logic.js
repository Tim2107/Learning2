const markingStyles = ['white','black','occupied','level1','level2','level3','level4','level5']
const ALLEGIANCE = ['white', 'black']
const PIECETYPE = ['pawn', 'bishop', 'knight', 'rook', 'queen', 'king', 'ultimate'] 
const waitTimeInMilliseconds = 100

const allFields = [];
for (let i = 1; i <= 8; i++) {
  for (let j = 'A'; j <= 'H'; j = String.fromCharCode(j.charCodeAt(0) + 1)) {
    allFields.push(j + i);
  }
}

var globalSettingsCounter = 1

if (document. readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready(){
var resetButton = document.getElementById("reset")
resetButton.addEventListener("click", resetFields)

var testButton = document.getElementById("test")
testButton.addEventListener("click", testDisplay)

var addAnalysisItemButton = document.getElementById("add-analyzer")
addAnalysisItemButton.addEventListener("click", addAnalysisSettingsItem)
}

async function testDisplay() {
    for (const index in allFields) {
        var piece = new Piece(getSelectedPieceTypes()[0], allFields[index])
        markFields(piece)
        await delay(waitTimeInMilliseconds)
        resetFields()
    }
}

function getSelectedPieceTypes() {
    var pieceTypes = document.getElementsByClassName("selector")
    var selectedPieceTypes = []
    for (const checkbox of pieceTypes) {
        if(checkbox.checked) {
            selectedPieceTypes.push(checkbox.value)
        }      
    }
    return selectedPieceTypes
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  
function markFields(piece){
    var fieldsToMark = getMoveStructur(piece)
    if(!fieldsToMark.length) {return}
    var style = []

    if(piece.getAllegiance() == 'white') {
        style.push('white')
        style.push('level1')
    }

    if(piece.getAllegiance() == 'black') {
        style.push('black')
        style.push('level1')
    }

    displayAnalysis(fieldsToMark, style)   
}

function unmarkFields(piece){
    var fieldsToUnmark = getMoveStructur(piece)
    if(!fieldsToUnmark.length) {return}
    var style = []

    if(piece.getAllegiance() == 'white') {
        style.push('white')
        style.push('level1')
    }

    if(piece.getAllegiance() == 'black') {
        style.push('black')
        style.push('level1')
    }
    
    hideAnalysis(fieldsToUnmark, style)   
}


function displayAnalysis(fieldsToHighlight, style) {
    for (const field of fieldsToHighlight) {
        var coordinates = field.split("")
        var targetFieldClasses = '.row-' + coordinates[1] + '.column-' + coordinates[0]
        var targetField = document.querySelectorAll(targetFieldClasses)[0]
        addStyle(targetField, style)
    }
}

function hideAnalysis(fieldsToHighlight, style) {
    for (const field of fieldsToHighlight) {
        var coordinates = field.split("")
        var targetFieldClasses = '.row-' + coordinates[1] + '.column-' + coordinates[0]
        var targetField = document.querySelectorAll(targetFieldClasses)[0]
        removeStyle(targetField, style)
    }
}

function addStyle(targetField, style) {
    for (const classNames of style) {
        targetField.classList.add(classNames)
    }
}

function removeStyle(targetField, style) {
    for (const classNames of style) {
        targetField.classList.remove(classNames)
    }
}

function resetFields(){
    var boardTiles = document.getElementsByClassName("tile")
    for (const tile of boardTiles) {
        for (var className of markingStyles){
        tile.classList.remove(className)
        }
    }
}

function convertNotation(input) {
    if (input >= 1 && input <= 8) {
      return String.fromCharCode(input + 64);
    } else if (input.toUpperCase() >= 'A' && input.toUpperCase() <= 'H') {
      return input.charCodeAt(0) - 64;
    }
}

function convertFieldIntoPositionNumbers(field) {
    var positions = field.split('')
    var positionsAsNumbers = [Number(convertNotation(positions[0])),Number(positions[1])]
    return positionsAsNumbers
}

function convertNumberPositionsIntoField(position1,position2) {
    return convertNotation(position1) + position2
}

function getMoveStructur(piece) {
    var moveOptions = piece.getMoveList();
    var moveList = []
        for(var key in moveOptions) {
            moveList = moveList.concat(moveOptions[key])
        }    
        return moveList
}

class Piece{
    pieceType
    #allegiance
    #kind
    #field

    constructor(pieceType, field){
        this.pieceType = pieceType
        this.#allegiance = this.#determineAllegiance()
        this.#kind = this.#determineKind()
        this.#field = field
    }

    #determineAllegiance() {
        return (this.pieceType.split("-"))[0]    
    }

    #determineKind() {
        return (this.pieceType.split("-"))[1]    
    }

    getAllegiance() {
        return this.#allegiance
    }

    getKind() {
        return this.#kind
    }

    getMoveList() {

        switch(this.#kind){

            case 'pawn':
                return getPawnMoves(this.#field, this.#allegiance)

            case 'bishop':
                return getBishopMoves(this.#field, this.#allegiance)
            
            case 'knight':
                 return getKnightMoves(this.#field, this.#allegiance)

            case 'rook':
                return getRookMoves(this.#field, this.#allegiance)

            case 'queen':
                return getQueenMoves(this.#field, this.#allegiance)

            case 'king':
                return getKingMoves(this.#field, this.#allegiance)
            
            case 'ultimate':
                return getUltimateMoves(this.#field, this.#allegiance)
        }
    }
}

function isOnBoard(positionNumber1, positionNumber2){
    if(positionNumber2 == null) {
        return boundariesCheck(positionNumber1)
    } 
    
    return (boundariesCheck(positionNumber1) && boundariesCheck(positionNumber2))
}

function boundariesCheck(positionNumber) {
    return (positionNumber > 0 && positionNumber < 9)
}


function getPawnMoves(field, allegiance) {
    
    var positions = convertFieldIntoPositionNumbers(field)
    var moveList = new Object()

    var northWestMoves = []
    var northMoves = []
    var northEastMoves = []
    
    var southWestMoves = []
    var southMoves = []
    var southEastMoves = []

    var i = positions[0]
    var j = positions[1]

    if(allegiance == 'white') {
        if(j == 1) {return}
        if(isOnBoard(i-1,j+1)) {
            northWestMoves.push(convertNumberPositionsIntoField(i-1,j+1))
            moveList.northWest = northWestMoves
        }
        if(isOnBoard(j+1)) {
            northMoves.push(convertNumberPositionsIntoField(i,j+1))
            moveList.north = northMoves
        }
        if(isOnBoard(i+1,j+1)) {
            northEastMoves.push(convertNumberPositionsIntoField(i+1,j+1))
            moveList.northEast = northEastMoves
        }
        if(j==2) {
            northMoves.push(convertNumberPositionsIntoField(i, j+2))
            moveList.north = northMoves
        }
    }

    if(allegiance == 'black') {
        if(j == 8) {return}
        if(isOnBoard(i-1,j-1)) {
            southWestMoves.push(convertNumberPositionsIntoField(i-1,j-1))
            moveList.southWest = southWestMoves
        }
        if(isOnBoard(j-1)) {
            southMoves.push(convertNumberPositionsIntoField(i,j-1))
            moveList.south = southMoves
        }
        if(isOnBoard(i+1,j-1)) {
            southEastMoves.push(convertNumberPositionsIntoField(i+1,j-1))
            moveList.southEast = southEastMoves
        }
        if(j==7) {
            southMoves.push(convertNumberPositionsIntoField(i, j-2))
            moveList.south = southMoves
        }
    }

    return moveList
}

function getBishopMoves(field, allegiance) {
   
    var positions = convertFieldIntoPositionNumbers(field)
    var moveList = new Object()

    var northEastMoves = []
    var southEastMoves = []
    var southWestMoves = []
    var northWestMoves = []

    for(let i = positions[0]+1, j = positions[1]+1;
        i < 9 && j < 9;
        i++, j++){      
        northEastMoves.push(convertNumberPositionsIntoField(i, j))
        moveList.northEast = northEastMoves
    }

    for(let i = positions[0]+1, j = positions[1]-1;
        i < 9 && j > 0;
        i++, j--){      
        southEastMoves.push(convertNumberPositionsIntoField(i, j))
        moveList.southEast = southEastMoves
    }

    for(let i = positions[0]-1, j = positions[1]-1;
        i > 0 && j > 0;
        i--, j--){      
        southWestMoves.push(convertNumberPositionsIntoField(i, j))
        moveList.southWest = southWestMoves
    }

    for(let i = positions[0]-1, j = positions[1]+1;
        i > 0 && j < 9;
        i--, j++){      
        northWestMoves.push(convertNumberPositionsIntoField(i, j))
        moveList.northWest = northWestMoves
    }

    return moveList
}

function getKnightMoves(field, allegiance) {

    var positions = convertFieldIntoPositionNumbers(field)
    var moveList = new Object()

    var northByWestMoves = []
    var northByEastMoves = []
    var eastByNorthMoves = []
    var eastBySouthMoves = []
    var southByEastMoves = []
    var southByWestMoves = []
    var westBySouthMoves = []
    var westByNorthMoves = []
    
    let x = positions[0]
    let y = positions[1]

    if((x-1) > 0 && (y+2) < 9) {      
        northByWestMoves.push(convertNumberPositionsIntoField(x-1, y+2))
        moveList.northByWest = northByWestMoves
    }
    if((x+1) < 9 && (y+2) < 9) {      
        northByEastMoves.push(convertNumberPositionsIntoField(x+1, y+2))
        moveList.northByEast = northByEastMoves
    }
    if((x+2) < 9 && (y+1) < 9) {      
        eastByNorthMoves.push(convertNumberPositionsIntoField(x+2, y+1))
        moveList.eastByNorth = eastByNorthMoves
    }
    if((x+2) < 9 && (y-1) > 0) {      
        eastBySouthMoves.push(convertNumberPositionsIntoField(x+2, y-1))
        moveList.eastBySouth = eastBySouthMoves
    }
    if((x+1) < 9 && (y-2) > 0) {      
        southByEastMoves.push(convertNumberPositionsIntoField(x+1, y-2))
        moveList.southByEast = southByEastMoves
    }
    if((x-1) > 0 && (y-2) > 0) {      
        southByWestMoves.push(convertNumberPositionsIntoField(x-1, y-2))
        moveList.southByWest = southByWestMoves
    }
    if((x-2) > 0 && (y-1) > 0) {      
        westBySouthMoves.push(convertNumberPositionsIntoField(x-2, y-1))
        moveList.westBySouth = westBySouthMoves
    }
    if((x-2) > 0 && (y+1) < 9) {      
        westByNorthMoves.push(convertNumberPositionsIntoField(x-2, y+1))
        moveList.westByNorth = westByNorthMoves
    }

    return moveList
}

function getRookMoves(field, allegiance) {
   
    var positions = convertFieldIntoPositionNumbers(field)
    var moveList = new Object()

    var northMoves = []
    var eastMoves = []
    var southMoves = []
    var westMoves = []

    for(let i = positions[1] + 1;  i < 9; i++){      
        northMoves.push(convertNumberPositionsIntoField(positions[0], i))
        moveList.north = northMoves
    }

    for(let i = positions[1] - 1;  i > 0; i--){      
        southMoves.push(convertNumberPositionsIntoField(positions[0], i))
        moveList.south = southMoves
    }

    for(let i = positions[0] - 1;  i > 0; i--){      
        westMoves.push(convertNumberPositionsIntoField(i, positions[1]))
        moveList.west = westMoves
    }

    for(let i = positions[0] + 1;  i < 9; i++){      
        eastMoves.push(convertNumberPositionsIntoField(i, positions[1]))
        moveList.east = eastMoves
    }
    
    return moveList
}
        
function getQueenMoves(field, allegiance) {
    var moveList = Object.assign({},getRookMoves(field),getBishopMoves(field))
    return moveList
}

function getKingMoves(field, allegiance){
    var queenMoveList = getQueenMoves(field)

    var moveList = new Object()

    for (const key in queenMoveList) {     
        moveList[key]=queenMoveList[key][0]
    }

   return moveList
}
   
function getUltimateMoves(field, allegiance) {
    var moveList = Object.assign({},getQueenMoves(field),getKnightMoves(field))
    return moveList
}


function addAnalysisSettingsItem(){
    var settingsItem = document.createElement('div')
    settingsItem.classList.add('analysis-settings-container')
    var analysisSettings = document.getElementsByClassName('analysis-settings')[0]

const analysisSettingsItem = `
<div class="allegiance-selector settings-item">
    <input type="radio" id="white${globalSettingsCounter}" name="allegiance${globalSettingsCounter}" value="white" checked>
    <label for="white${globalSettingsCounter}" class="allegiance-selector-item">WHITE</label>
    <input type="radio" id="black${globalSettingsCounter}" name="allegiance${globalSettingsCounter}" value="black">
    <label for="black${globalSettingsCounter}" class="allegiance-selector-item">BLACK</label>
</div>
<div class="analysis-type-selector settings-item">
<input type="radio" id="pawn${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="pawn" checked>
<label for="pawn${globalSettingsCounter}" class="type-selector-item">PAWN</label>
<input type="radio" id="bishop${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="bishop">
<label for="bishop${globalSettingsCounter}" class="type-selector-item">BISHOP</label>                    
<input type="radio" id="knight${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="knight">
<label for="knight${globalSettingsCounter}" class="type-selector-item">KNIGHT</label>
<input type="radio" id="rook${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="rook">
<label for="rook${globalSettingsCounter}" class="type-selector-item">ROOK</label>
<input type="radio" id="queen${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="queen">
<label for="queen${globalSettingsCounter}" class="type-selector-item">QUEEN</label>
<input type="radio" id="king${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="king">
<label for="king${globalSettingsCounter}" class="type-selector-item">KING</label>
<input type="radio" id="knight-path${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="knight-path">
<label for="knight-path${globalSettingsCounter}" class="type-selector-item">KNIGHT PATH</label>
<input type="radio" id="ultimate${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="ultimate">
<label for="ultimate${globalSettingsCounter}" class="type-selector-item">ULTIMATE</label>
</div>
<div class="analysis-controls settings-item">
    <input type="text" class="field-input analysis-controls-item" pattern="[A-H]+[1-8]" title="Please enter a valid chessboard field!" value="A1">
    <label class="switch analysis-controls-item">
        <input type="checkbox" class="analysis-toggle">
        <span class="slider round"></span>
    </label>
    <button type="button" class="btn btn-remove analysis-controls-item">x</button>
</div>
`
    settingsItem.innerHTML=analysisSettingsItem
    analysisSettings.append(settingsItem)
    
    var fieldInput = settingsItem.getElementsByClassName('field-input')[0]
    var analysisToggle = settingsItem.getElementsByClassName('analysis-toggle')[0]
    var removeButton = settingsItem.getElementsByClassName('btn-remove')[0]
    
    analysisToggle.addEventListener('click', toggleAnalysis)
    removeButton.addEventListener('click', removeAnalysisItem)
    globalSettingsCounter++
}

function checkInput(input) {
    if(isValidChessField(input)) {
        return input
    }
    else {
        return checkInput(promptForValidInput())
    }
}

function isValidChessField(field) {
    if (typeof field !== 'string')  {return false}
    if (field.length !== 2)         {return false}
    if (!/[A-H]/.test(field[0]))    {return false}
    if (!/[1-8]/.test(field[1]))    {return false}
    return true;
}  

function promptForValidInput() {
    var infoMessage = `
    Please enter a valid input.
    Valid inputs are fields in the form column (A-Z) + row (1-8).
    Example: A1
    `
    return prompt(infoMessage,'')    
}

function toggleAnalysis(event){
    var toggle = event.target
    var targetAnalyzer = toggle.parentElement.parentElement.parentElement
    var allegianceSelection = targetAnalyzer.getElementsByClassName('allegiance-selector')[0].getElementsByTagName("input")
    var selectedAllegiance = getSelectedItem(allegianceSelection).value
    var typeSelection = targetAnalyzer.getElementsByClassName('analysis-type-selector')[0].getElementsByTagName("input")
    var selectedType = getSelectedItem(typeSelection).value
    var selectedPiece = selectedAllegiance + "-" + selectedType
    var analysisControls = toggle.parentElement.parentElement
    var fieldInputIterable = analysisControls.getElementsByClassName('field-input')
    var fieldInput = fieldInputIterable[0]
    if(toggle.checked) {
        fieldInput.value = checkInput(fieldInput.value)
        var piece = new Piece(selectedPiece, fieldInput.value)
        markFields(piece)
        lockSelection(allegianceSelection)
        lockSelection(typeSelection)  
        lockSelection(fieldInputIterable)
    } else {
        var piece = new Piece(selectedPiece, fieldInput.value)
        unmarkFields(piece)
        unlockSelection(allegianceSelection)
        unlockSelection(typeSelection)
        unlockSelection(fieldInputIterable)
    }
}

function lockSelection(selection) {
    for (const item of selection) {
        item.disabled = true    }
}

function unlockSelection(selection) {
    for (const item of selection) {
        item.disabled = false    }
}

function getSelectedItem(selection){
    for (const item of selection) {
        if(item.checked)
        return item
    }
}

function removeAnalysisItem(event) {
    var buttonClicked = event.target
    var analysisToggle = buttonClicked.parentElement.getElementsByClassName("analysis-toggle")[0]
    if(analysisToggle.checked) {analysisToggle.click()}
    var targetAnalyzer = buttonClicked.parentElement.parentElement
    targetAnalyzer.remove()
}

