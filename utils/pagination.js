function paginate(input, page = 1, count = 4) {
    const total = input.length
    const start = (page - 1) * count
    const end = (page) * count

    if (end < total - 1) {
        const split = input.slice(start, end)
        const pages = Math.ceil(split.length)
        return [split, pages]

    }
    else return [[],0]
}

module.exports = { paginate } 