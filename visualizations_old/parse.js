export function parse(row) {
    // noinspection JSUnresolvedVariable
    return {
        id: +row.id,
        class: row.recclass,
        name: row.name,
        mass: +row.mass,
        fall: row.fall,
        // year: new Date(+row.year, 0, 1),
        year: +row.year,
        latitude: +row.reclat,
        longitude: +row.reclong,
        country: row.country
    }
}
