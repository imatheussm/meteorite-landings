export let selectedClasses = [],
    selectedTypes = ["Fell", "Found"],
    massRange = [0, 100]


export function updateSelectedTypes(aList) {
    selectedTypes = aList
}


export function updateMassRange(aList) {
    massRange = aList
}
