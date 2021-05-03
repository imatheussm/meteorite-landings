export function meteoriteLandings(row) {
    // noinspection JSUnresolvedVariable
    return {
        id: +row.id,
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
