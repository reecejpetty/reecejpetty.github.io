const keyboardHexMap = {
    "[ESC]": "29",
    "[F1]": "3A",
    "[F2]": "3B",
    "[F3]": "3C",
    "[F4]": "3D",
    "[F5]": "3E",
    "[F6]": "3F",
    "[F7]": "40",
    "[F8]": "41",
    "[F9]": "42",
    "[F10]": "43",
    "[F11]": "44",
    "[F12]": "45",
    "[PRINT_SCREEN]":"46",
    "[SCROLL_LOCK]": "47",
    "[PAUSE]": "48",
    "`": "35",
    "1": "1E",
    "2": "1F",
    "3": "20",
    "4": "21",
    "5": "22",
    "6": "23",
    "7": "24",
    "8": "25",
    "9": "26",
    "0": "27",
    "-": "2D",
    "=": "2E",
    "[BACKSPACE]": "2A",
    "[TAB]": "2B",
    "Q": "14",
    "W": "1A",
    "E": "08",
    "R": "15",
    "T": "17",
    "Y": "1C",
    "U": "18",
    "I": "0C",
    "O": "12",
    "P": "13",
    "[": "2F",
    "]": "30",
    "\\": "31",
    "[CAPS_LOCK]": "39",
    "A": "04",
    "S": "16",
    "D": "07",
    "F": "09",
    "G": "0A",
    "H": "0B",
    "J": "0D",
    "K": "0E",
    "L": "0F",
    ";": "33",
    "'": "34",
    "[ENTER]": "28",
    "[L_SHIFT]": "E1",
    "Z": "1D",
    "X": "1B",
    "C": "06",
    "V": "19",
    "B": "05",
    "N": "11",
    "M": "10",
    ",": "36",
    ".": "37",
    "/": "38",
    "[R_SHIFT]": "E5",
    "[L_CTRL]": "E0",
    "[L_WIN]": "E3",
    "[L_ALT]": "E2",
    " ": "2C",
    "[R_ALT]": "E6",
    "[R_WIN]": "E7",
    "[MENU]": "65",
    "[R_CTRL]": "E4",
    "[INSERT]": "49",
    "[HOME]": "4A",
    "[PAGE_UP]": "4B",
    "[DELETE]": "4C",
    "[END]": "4D",
    "[PAGE_DOWN]": "4E",
    "[UP_ARROW]": "52",
    "[LEFT_ARROW]": "50",
    "[DOWN_ARROW]": "51",
    "[RIGHT_ARROW]": "4F",
    "[NUM_LOCK]": "53",
    "[NUM_/]": "54",
    "[NUM_*]": "55",
    "[NUM_-]": "56",
    "[NUM_+]": "57",
    "[NUM_ENTER]": "58",
    "[NUM_1]": "59",
    "[NUM_2]": "5A",
    "[NUM_3]": "5B",
    "[NUM_4]": "5C",
    "[NUM_5]": "5D",
    "[NUM_6]": "5E",
    "[NUM_7]": "5F",
    "[NUM_8]": "60",
    "[NUM_9]": "61",
    "[NUM_0]": "62",
    "[NUM_.]": "63"
}

class Key {
    constructor(keyPresses) {
        this.keyPresses = keyPresses;
    }
}

class KeyPress {
    constructor(string, usage, modifier) {
        this.string = string;
        this.usage = usage;
        this.modifier = modifier;
    }
}

let currentKey;
let buildSequence = [];
let keys = [];

document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < 30; i++) {
        // Get HTML information
        const cell = document.getElementById(`${i}`);
        const cellContent = cell.querySelector(".cell-content");
        const keyContent = cellContent.querySelector(".key");
        const modifierContent = cellContent.querySelector(".modifier");
        // Create new keyPress sequence object
        const keyPresses = [];
        const string = keyContent.textContent;
        if (!(string.toUpperCase() in keyboardHexMap)) {
            for (const char of string) {
                const keyPress = new KeyPress(char, keyboardHexMap[char.toUpperCase()], modifierContent.textContent);
                keyPresses.push(keyPress);
            }
        } else {
            const keyPress = new KeyPress(string, keyboardHexMap[string.toUpperCase()], modifierContent.textContent);
            keyPresses.push(keyPress);
        }
        const key = new Key(keyPresses);
        keys.push(key);
    }
})

function configureButton(event) {
    resetSequence();
    const currentSequence = document.getElementById("current_sequence");
    if (currentKey == null){
        // If first key clicked, currentKey is just the clicked key
        currentKey = event.currentTarget;
        currentKey.style.backgroundColor = "yellow";
    } else if (currentKey == event.currentTarget) {
        // If the same key is clicked twice, makes it inactive and unchecks Modifiers checkboxes
        currentKey.style.backgroundColor = "lightgray";
        currentKey = null;
    } else {
        // Sets past key to inactive and sets clicked key to currentKey
        currentKey.style.backgroundColor = "lightgray";
        currentKey = event.currentTarget;
        currentKey.style.backgroundColor = "yellow";
    }

    if (currentKey != null) {
        const index = parseInt(currentKey.id);
        const key = keys[index];
        let sequenceString = "";
        // Populate Current Key Sequence with current key's strings
        for (let i = 0; i < key.keyPresses.length; i++) {
            sequenceString += key.keyPresses[i].string;
        }
    }
}

function addStringToSequence() {
    const ctrlCheckbox = document.getElementById("ctrl");
    const shiftCheckbox = document.getElementById("shift");
    const altCheckbox = document.getElementById("alt");
    const winCheckbox = document.getElementById("win");
    const modifiers = [ctrlCheckbox, shiftCheckbox, altCheckbox, winCheckbox];
    let modifierString = "";
    for (const modifier of modifiers) {
        if (modifier.checked == true) {
            modifierString += modifier.id + "+";
        }
    }

    const keySequence = document.getElementById("key_sequence");
    let currentSequence = document.getElementById("current_sequence");
    if (keySequence.value != "") {
        if (modifierString != "") {
            currentSequence.textContent += `[${modifierString.toUpperCase()}${keySequence.value}]`;
        } else {
            currentSequence.textContent += keySequence.value;
        }
        for (const char of keySequence.value) {
            const keyPress = new KeyPress(char, keyboardHexMap[char.toUpperCase()], convertToHex());
            buildSequence.push(keyPress);
        }
        keySequence.value = "";
    }
    clearModifiers();
}

function addButtonToSequence(event) {
    const button = event.currentTarget;
    let currentSequence = document.getElementById("current_sequence");
    currentSequence.textContent += button.value;
    const keyPress = new KeyPress(button.value, keyboardHexMap[button.value], convertToHex());
    buildSequence.push(keyPress);
    clearModifiers();
    console.log(keys);
}

function addPauseToSequence() {
    const pauseTime = document.getElementById("pause_input").value;
    const pauseTimeNumber = parseInt(pauseTime);
    const pauseTimeFormatted = pauseTime.padStart(2, "0");
    const pauseTimeString = `[PAUSE: ${pauseTimeFormatted}]`
    if (61 > pauseTimeNumber && pauseTimeNumber > 0) {
        const keyPress = new KeyPress(pauseTimeString, "FE", `0x${pauseTimeFormatted}`);
        buildSequence.push(keyPress);
    }
    let currentSequence = document.getElementById("current_sequence");
    currentSequence.textContent += pauseTimeString;
}

function resetSequence() {
    const currentSequence = document.getElementById("current_sequence");
    const keySequence = document.getElementById("key_sequence");
    keySequence.value = "";
    currentSequence.textContent = "";
    clearModifiers();
    buildSequence = [];
}

function clearModifiers() {
    const ctrlCheckbox = document.getElementById("ctrl");
    const shiftCheckbox = document.getElementById("shift");
    const altCheckbox = document.getElementById("alt");
    const winCheckbox = document.getElementById("win");
    ctrlCheckbox.checked = false;
    shiftCheckbox.checked = false;
    altCheckbox.checked = false;
    winCheckbox.checked = false;
}

function updateKey() {
    // Update currentKey with new key sequence
    const index = currentKey.id;
    if (buildSequence.length < 1) {
        const blankKey = new KeyPress("", "00", "0x00");
        buildSequence.push(blankKey);
    }
    const newKey = new Key(buildSequence);
    keys[index] = newKey;

    // Update HTML with new key sequence
    const cellContent = currentKey.querySelector(".cell-content");
    const key = cellContent.querySelector(".key");
    const modifier = cellContent.querySelector(".modifier");
    const currentSequence = document.getElementById("current_sequence");
    key.textContent = currentSequence.textContent; 

    currentKey.style.backgroundColor = "lightgreen";
    resetSequence();
}


function createKRS() {
    // Get values of bumpbar options
    const error = document.getElementById("download_error");
    if (error.style.display == "block") {
        error.style.display = "none";
    }
    const templateName = document.getElementById("template_name").value;
    const connection = document.getElementById("connection_dropdown").value;
    const mode = document.getElementById("mode_dropdown").value;
    const sound = document.querySelector('input[name="speaker"]:checked').value;
    let lock = document.querySelector('input[name="lock_sound"]:checked').value;
    if (lock == "other") {
        lock = document.getElementById("other_text").value;
    }

    // Get current time and date
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US');
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })

    // Write xml file
    let xml = "";
    xml += `<?xml version="1.0" encoding="utf-8"?>\n`;
    xml += `<krs_config>\n`;
    xml += `    <properties filename="${templateName}">\n`;
    xml += `    </properties>\n`;
    xml += `    <version ver="1" date="${formattedDate}" time="${formattedTime}">\n`;
    xml += `        <config connect="${connection}" serial="9600N81" mode="${mode}" sound="${sound}" lock="${lock}">\n`;
    xml += `        </config>\n`;
    for (let i = 0; i < 30; i++) {
        xml += `        <key keynum="${i + 1}">\n`;
        for (const keyPress of keys[i].keyPresses) {
            xml += `            <seq usage="0x${keyPress.usage}" modifier="${keyPress.modifier}">${keyPress.string}</seq>\n`;
        }
        xml += `        </key>\n`;
    }
    xml += `    </version>\n`;
    xml += `</krsconfig>\n`;

    const file = document.getElementById("file");
    file.style.visibility = "visible";
    file.textContent = xml;
    sendHeightToParent();
}

// function copyKRS() {
//     const file = document.getElementById("file");
//     if (file.textContent != ''){
//         navigator.clipboard.writeText(file.textContent).then(() => {
//             alert("KRS File copied to clipboard. To save, paste into empty Notepad file, then save as \"template_name\".krs");
//         }).catch(err => {
//             console.error("Failed to copy text: ", err);
//         })
//     }
// }

function downloadKRS() {
    const file = document.getElementById("file");
    console.log(file.textContent);
    if (file.textContent != "") {
        const fileName = document.getElementById("template_name").value
        const xml = file.textContent;
        const blob = new Blob([xml], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.krs`;
        link.click();
        URL.revokeObjectURL(link.href);
    } else {
        document.getElementById("download_error").style.display = "block";
    }
}

function convertToHex() {
    const ctrlCheckbox = document.getElementById("ctrl");
    const shiftCheckbox = document.getElementById("shift");
    const altCheckbox = document.getElementById("alt");
    const winCheckbox = document.getElementById("win");

    let sum = 0;
    if (ctrlCheckbox.checked) sum += parseInt(ctrlCheckbox.value);
    if (shiftCheckbox.checked) sum += parseInt(shiftCheckbox.value);
    if (altCheckbox.checked) sum += parseInt(altCheckbox.value);
    if (winCheckbox.checked) sum += parseInt(winCheckbox.value);

    const hexadecimal = sum.toString(16).toUpperCase();
    return `0x0${hexadecimal}`;
}

function convertFromHex(string) {
    const ctrlCheckbox = document.getElementById("ctrl");
    const shiftCheckbox = document.getElementById("shift");
    const altCheckbox = document.getElementById("alt");
    const winCheckbox = document.getElementById("win");

    const hexString = string.slice(2);
    const decString = parseInt(hexString, 16);
    let num = decString;

    switch(num) {
        case 15:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = true;
            altCheckbox.checked = true;
            winCheckbox.checked = true;
            break;
        case 14:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = true;
            altCheckbox.checked = true;
            winCheckbox.checked = true;
            break;
        case 13:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = false;
            altCheckbox.checked = true;
            winCheckbox.checked = true;
            break;
        case 12:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = false;
            altCheckbox.checked = true;
            winCheckbox.checked = true;
            break;
        case 11:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = true;
            altCheckbox.checked = false;
            winCheckbox.checked = true;
            break;
        case 10:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = true;
            altCheckbox.checked = false;
            winCheckbox.checked = true;
            break;
        case 9:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = false;
            altCheckbox.checked = false;
            winCheckbox.checked = true;
            break;
        case 8:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = false;
            altCheckbox.checked = false;
            winCheckbox.checked = true;
            break;
        case 7:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = true;
            altCheckbox.checked = true;
            winCheckbox.checked = false;
            break;
        case 6:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = true;
            altCheckbox.checked = true;
            winCheckbox.checked = false;
            break;
        case 5:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = false;
            altCheckbox.checked = true;
            winCheckbox.checked = false;
            break;
        case 4:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = false;
            altCheckbox.checked = true;
            winCheckbox.checked = false;
            break;
        case 3:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = true;
            altCheckbox.checked = false;
            winCheckbox.checked = false;
            break;
        case 2:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = true;
            altCheckbox.checked = false;
            winCheckbox.checked = false;
            break;
        case 1:
            ctrlCheckbox.checked = true;
            shiftCheckbox.checked = false;
            altCheckbox.checked = false;
            winCheckbox.checked = false;
            break;
        default:
            ctrlCheckbox.checked = false;
            shiftCheckbox.checked = false;
            altCheckbox.checked = false;
            winCheckbox.checked = false;
            break;
    }
}

function sendHeightToParent() {
    var height = document.body.scrollHeight + 50; // Get the height of the content inside the iframe
    console.log('Sending height to parent:', height); // Debug message
    window.parent.postMessage(height, 'https://krscorporation.com/pages/online-configurator'); // Send the height to the parent
    console.log(height);
  }
  
  // Send the height on page load and also after resizing (optional)
  window.onload = sendHeightToParent;
  window.onresize = sendHeightToParent;