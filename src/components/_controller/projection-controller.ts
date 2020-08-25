// REDUX - ACTION_CREATORS
import { storeProjectionsAction, showProjectionsAction } from '../_model/redux/actions/actions-creators';

// REDUX - STORE
import reduxStore from '../_model/redux/redux-store';

// MODEL
import BoundingBox from '../_model/entity/bounding-box';


class ProjectionController {

    public constructor() { }

    public storeProjectionsList = (projections: BoundingBox[]): any => {

        return reduxStore.dispatch(
            storeProjectionsAction(projections)
        );
    }

    public showProjections = (obj: object): BoundingBox[] => {

        return reduxStore.getState().projections;
    }   

    public getProjectionByID = (id: string): BoundingBox => {

        return reduxStore.getState().projections.filter((elem: BoundingBox) => {

            if (elem.crs == id)
                return elem;
        })[0];
    }

    public subscribeToStore = (callback: any): any => {

		reduxStore.subscribe(() => {
            
            callback(reduxStore.getState().projections);
		});
    }
}

// SINGLETON
// Export an instance of the class directly
export default new ProjectionController();