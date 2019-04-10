module.exports.removeFromArray = (element, arr) => {
    const index = arr.indexOf(element)
    if (index === -1) {
        return
    }
    arr.splice(index, 1);
}
