export function boundingBox(elements) {
    if (elements.classed("uk-hidden") === false) {
        let boundingBox = elements.node().getBBox()


        elements.attr(
            "viewBox",
            `${boundingBox.x} ${boundingBox.y} ${boundingBox.width} ${boundingBox.height}`
        )
    }
}
