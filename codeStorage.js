function markLanes() {
    var input = document.getElementById("targets").value
    var fieldsToMark = ""

    if(input.includes("1")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-1"
        } else {
            fieldsToMark += ",.row-1"
        }
    }
    if(input.includes("2")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-2"
        } else {
            fieldsToMark += ",.row-2"
        }
    }
    if(input.includes("3")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-3"
        } else {
            fieldsToMark += ",.row-3"
        }
    }
    if(input.includes("4")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-4"
        } else {
            fieldsToMark += ",.row-4"
        }
    }
    if(input.includes("5")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-5"
        } else {
            fieldsToMark += ",.row-5"
        }
    }
    if(input.includes("6")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-6"
        } else {
            fieldsToMark += ",.row-6"
        }
    }
    if(input.includes("7")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-7"
        } else {
            fieldsToMark += ",.row-7"
        }
    }
    if(input.includes("8")){
        if(fieldsToMark==="") {
            fieldsToMark = ".row-8"
        } else {
            fieldsToMark += ",.row-8"
        }
    }

    if(input.includes("A")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-A"
        } else {
            fieldsToMark += ",.column-A"
        }
    }
    if(input.includes("B")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-B"
        } else {
            fieldsToMark += ",.column-B"
        }
    }
    if(input.includes("C")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-C"
        } else {
            fieldsToMark += ",.column-C"
        }
    }
    if(input.includes("D")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-D"
        } else {
            fieldsToMark += ",.column-D"
        }
    }
    if(input.includes("E")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-E"
        } else {
            fieldsToMark += ",.column-E"
        }
    }
    if(input.includes("F")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-F"
        } else {
            fieldsToMark += ",.column-F"
        }
    }
    if(input.includes("G")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-G"
        } else {
            fieldsToMark += ",.column-G"
        }
    }
    if(input.includes("H")){
        if(fieldsToMark==="") {
            fieldsToMark = ".column-H"
        } else {
            fieldsToMark += ",.column-H"
        }
    }
    
    var selectedFields = document.querySelectorAll(fieldsToMark)
    for (const field of selectedFields) {
        field.classList.add("marked")
    }
}
