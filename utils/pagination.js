function paginate(input, page = 1, count = 4) {
    const total = input.length
    const start = (page - 1) * count
    const end = (page) * count > total ? (total) : ((page) * count)

    const split = input.slice(start, end)
    const pages = Math.ceil(total/count)
    return [split, pages]
}

module.exports = { paginate } 