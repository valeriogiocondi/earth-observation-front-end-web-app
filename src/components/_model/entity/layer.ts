import BoundingBox from './bounding-box';
import Style from './style';

type Layer = {

    id: string,
    isQueryable: number,
    name: string | null,
    abstract?: string | null,
    boundingBox: BoundingBox[],
    style?: Style,
    minScaleDenominator?: string | null,
    maxScaleDenominator?: string | null,
    layers?: Layer[],
    index: number,
    isSelected: boolean,
};

export default Layer;