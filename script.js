// Global variables

let maxHeight = window.innerHeight * 0.9
let maxWidth = window.innerWidth * 0.9
const minHeight = 100
const minWidth = 100
const minBlockAmount = 50
const minBlockSize = 20
let isMouseDown = false
let selectedColor = "black"

// Elements

const page = document.querySelector('.container')
const easGrid = document.querySelector('.etch-a-sketch-grid')
const createGrid = document.querySelector('.create-grid')
const heightField = document.querySelector('.input-height')
const widthField = document.querySelector('.input-width')
const blockField = document.querySelector('.input-block')
const borderField = document.querySelector('.input-border')

const colorBlack = document.querySelector('.color-black')
const colorWhite = document.querySelector('.color-white')
const colorRed = document.querySelector('.color-red')
const colorGreen = document.querySelector('.color-green')
const colorBlue = document.querySelector('.color-blue')
const colorYellow = document.querySelector('.color-yellow')

// Initialize the grid on load
drawGrid(Number(heightField.value), Number(widthField.value), Number(blockField.value), borderField.checked)

// Listeners

createGrid.addEventListener('click', function () { drawGrid(Number(heightField.value), Number(widthField.value), Number(blockField.value), borderField.checked) })
page.addEventListener('mousedown', (function () {
    isMouseDown = true
    console.log(isMouseDown)
}))
page.addEventListener('mouseup', (function () {
    isMouseDown = false
    console.log(isMouseDown)
}))
page.addEventListener('dragstart', (function () {
    isMouseDown = true
    console.log(isMouseDown)
}))
page.addEventListener('dragend', (function () {
    isMouseDown = false
    console.log(isMouseDown)
}))

// Color listeners

colorBlack.addEventListener('click', function () { selectedColor = "black" })
colorWhite.addEventListener('click', function () { selectedColor = "white" })
colorRed.addEventListener('click', function () { selectedColor = "red" })
colorGreen.addEventListener('click', function () { selectedColor = "green" })
colorBlue.addEventListener('click', function () { selectedColor = "blue" })
colorYellow.addEventListener('click', function () { selectedColor = "yellow" })


// Drawing the grid functions

function drawGrid(requestedGridHeight, requestedGridWidth, requestedBlockSize, hasBorder) {
    console.log(requestedGridHeight)
    console.log(requestedGridWidth)
    console.log(requestedBlockSize)
    console.log(hasBorder)
    document.querySelectorAll('.etch-a-sketch-grid div').forEach(
        block => easGrid.removeChild(block)
    )

    const safeGridHeight = calculateSafeGridHeight(requestedGridHeight)
    const safeGridWidth = calculateSafeGridWidth(requestedGridWidth)

    const safeBlockSize = calculateSafeBlockSize(requestedBlockSize, safeGridHeight, safeGridWidth)

    const roundedSafeGridHeight = roundToNearest(safeBlockSize, safeGridHeight, maxHeight)
    const roundedSafeGridWidth = roundToNearest(safeBlockSize, safeGridWidth, maxWidth)

    easGrid.style.height = roundedSafeGridHeight + "px"
    easGrid.style.width = roundedSafeGridWidth + "px"

    const blockSizeWithBorder = hasBorder ? safeBlockSize - 2 : safeBlockSize // Removing 2 pixels if border is present
    const blocksToAdd = calculateBlocksToAdd(roundedSafeGridHeight, roundedSafeGridWidth, safeBlockSize)

    for (let i = 0; i < blocksToAdd; i++) {
        addBlockToGrid(blockSizeWithBorder, hasBorder, i)
        console.log('Block added: ' + i)
    }
}

function addBlockToGrid(blockSize, hasBorder, i) {
    const block = document.createElement('div')
    block.setAttribute("data-block-id", i)
    block.setAttribute("draggable", false)
    block.style.height = blockSize + "px"
    block.style.width = blockSize + "px"
    hasBorder ? block.style.border = "1px solid black" : ''

    block.addEventListener('mousemove', function (e) {
        changeBlockBackground(this, e, selectedColor)
    })
    block.addEventListener('dragover', function (e) {
        changeBlockBackground(this, e, selectedColor)
    })
    block.addEventListener('click', function (e) {
        changeBlockBackground(this, e, selectedColor)
    })

    easGrid.appendChild(block)
}

// Drawing functions

function changeBlockBackground(block, event, color = "black") {
    if (isMouseDown && (event.type == "mousemove" || event.type == "dragover")) {
        block.style.backgroundColor = color
    } else if (event.type == "click") {
        block.style.backgroundColor = color
    }
}

// Utils

function roundToNearest(roundTo, number, max) {
    const calculated = Math.round(number / roundTo) * roundTo
    return calculated <= max ? calculated : calculated - roundTo
}

function calculateSafeGridHeight(requestedGridHeight) {
    return requestedGridHeight >= maxHeight
        ? maxHeight
        : requestedGridHeight <= minHeight
            ? minHeight
            : requestedGridHeight
}

function calculateSafeGridWidth(requestedGridWidth) {
    return requestedGridWidth >= maxWidth
        ? maxWidth
        : requestedGridWidth <= minWidth
            ? minWidth
            : requestedGridWidth
}

function calculateSafeBlockSize(blockSize, height, width) {
    if (calculateBlocksToAdd(height, width, blockSize) >= minBlockAmount) {
        console.log(blockSize)
        return blockSize >= minBlockSize
            ? blockSize
            : calculateSafeBlockSize(minBlockSize, height, width)
    } else {
        return calculateSafeBlockSize(minBlockSize, height, width)
    }
}

function calculateBlocksToAdd(height, width, blockSize) {
    return (height / blockSize) * (width / blockSize)
}