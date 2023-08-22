import useRoute from './useRoute';

export interface ClassificationRouteParams {
  learning_packet: number;
  sub_learning_packet: number;
  learning_category: number;
}

export interface ClassificationRouteReturnParams {
  learning_packet_id: number;
  sub_learning_packet_id: number;
  learning_category_id: number;
}

export default function useDefaultClassificationRouteParams(): ClassificationRouteReturnParams {
  const route = useRoute();
  const { learning_packet, sub_learning_packet, learning_category } = route()
    .params as unknown as ClassificationRouteParams;
  
  const learning_packet_id = Number(learning_packet);
  const sub_learning_packet_id = Number(sub_learning_packet);
  const learning_category_id = Number(learning_category);

  return {
    learning_packet_id,
    sub_learning_packet_id,
    learning_category_id,
  };
}
