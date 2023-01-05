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

    #determineAllegiance()  {return (this.pieceType.split("-"))[0]}
    #determineKind()        {return (this.pieceType.split("-"))[1]}
    getAllegiance()         {return this.#allegiance}
    getKind()               {return this.#kind}
    getField()              {return this.#field}

    getMoveList() {
        switch(this.#kind){
            case 'pawn':        return getPawnMoves(this.#field, this.#allegiance)
            case 'bishop':      return getMoves(this, bishopColumnInstructions, bishopRowInstructions)
            case 'knight':      return getKnightMoves(this)
            case 'rook':        return getMoves(this, rookColumnInstructions, rookRowInstructions)
            case 'queen':       return getQueenMoves(this)
            case 'king':        return getKingMoves(this)
            case 'ultimate':    return getUltimateMoves(this)
        }
    }
}

function isOnBoard(positionNumber1, positionNumber2){
    if(positionNumber2 == null) {return boundariesCheck(positionNumber1)} 
    return (boundariesCheck(positionNumber1) && boundariesCheck(positionNumber2))
}

function boundariesCheck(positionNumber) {
    return (positionNumber > 0 && positionNumber < 9)
}

function getMoves(piece, columnInstructions, rowInstructions) {
   
    var positions = convertFieldIntoPositionNumbers(piece.getField())
    var moveList = new Object()

    for (z = 0; z < 4; z++){
        
        var directionLabel =  piece.getKind() + '-direction-' + z
        var moves = []
        
        var x = columnInstructions(z)
        var y = rowInstructions(z)
        
        for(let i = positions[0] + x, j = positions[1] + y;
            isOnBoard(i,j);
            i += x, j += y){      
            moves.push(convertNumberPositionsIntoField(i, j))
            moveList[directionLabel] = moves
        }
    }
    return moveList
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

function bishopColumnInstructions(n) {
    return((1<n) ? 1 : -1)
}

function bishopRowInstructions(n) {
    return((n%2==0) ? 1 : -1)
}


function knightShortColumnInstructions(n) {
    return((1<n) ? 1 : -1)
}

function knightLongColumnInstructions(n) {
    return((1<n) ? 2 : -2)
}

function knightShortRowInstructions(n) {
    return((n%2==0) ? 1 : -1)
}

function knightLongRowInstructions(n) {
    return((n%2==0) ? 2 : -2)
}

function getKnightMoves(piece) {
    var moveList = Object.assign({},
        getMoves(new Piece(piece.getAllegiance()+'-knight_A', piece.getField()), knightLongColumnInstructions, knightShortRowInstructions),
        getMoves(new Piece(piece.getAllegiance()+'-knight_B', piece.getField()), knightShortColumnInstructions, knightLongRowInstructions))

        for (const key in moveList) {     
            moveList[key]=moveList[key][0]
        }
       return moveList
}

function rookColumnInstructions(n) {
    return ((n < 2) ? 0 : Math.pow(-1,n))
}

function rookRowInstructions(n) {
    return ((n > 1) ? 0 : Math.pow(-1,n))
}
          
function getQueenMoves(piece) {
    var moveList = Object.assign({},
        getMoves(new Piece(piece.getAllegiance()+'-queen_rook_part', piece.getField()), rookColumnInstructions, rookRowInstructions),
        getMoves(new Piece(piece.getAllegiance()+'-queen_bishop_part', piece.getField()), bishopColumnInstructions, bishopRowInstructions))
    return moveList
}

function getKingMoves(piece){
    var queenMoveList = getQueenMoves(new Piece(piece.getAllegiance()+'-king', piece.getField()))

    var moveList = new Object()

    for (const key in queenMoveList) {     
        moveList[key]=queenMoveList[key][0]
    }

   return moveList
}
   
function getUltimateMoves(piece) {
    var moveList = Object.assign({},getQueenMoves(piece),getKnightMoves(piece))
    return moveList
}

function generateHTMLTypeSelection(pieces) {
    let htmlSelection = '';
    for (let i = 0; i < pieces.length; i++) {
        let addCheckedToFirstItem = 'checked'
        if(i != 0) {addCheckedToFirstItem = ''}
        htmlSelection +=
            `<input type="radio" id="${pieces[i]}${globalSettingsCounter}" name="analysis-type${globalSettingsCounter}" value="${pieces[i]}" ${addCheckedToFirstItem} ">
             <label for="${pieces[i]}${globalSettingsCounter}" class="type-selector-item">${pieces[i].toUpperCase()}</label>`;
    }
    return htmlSelection;
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
${generateHTMLTypeSelection(PIECETYPE)}
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
    return true
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

