import useRoute from "./useRoute";

export interface ClassificationRouteParams {
    learning_packet: number;
    sub_learning_packet: number;
    learning_category: number;
}


export default function useDefaultClassificationRouteParams(): ClassificationRouteParams {

    const route = useRoute();
    const {
        learning_packet,
        sub_learning_packet,
        learning_category,
    } = route().params as unknown as ClassificationRouteParams;

    return {
        learning_packet,
        sub_learning_packet,
        learning_category,
    };
}
