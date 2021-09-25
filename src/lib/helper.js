function crop(str, maxLength) {
    if (!str) return str

    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str
}


export {
    crop
}