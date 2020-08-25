type BoundingBox = {

    crs: string | null,
    westBoundLongitude: number, /* AKA minX */
    eastBoundLongitude: number, /* AKA maxX */
    southBoundLatitude: number, /* AKA minY */
    northBoundLatitude: number, /* AKA maxY */
};

export default BoundingBox;