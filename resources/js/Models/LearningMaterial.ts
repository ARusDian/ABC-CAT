import { BaseDocumentFileModel, DocumentFileModel } from "./FileModel";

export interface BaseLearningMaterialModel { 
    id?: number;
    title: string;
    description: string;
    images?: string[];
    documents: BaseLearningMaterialDocumentModel[];
}

export interface LearningMaterialModel extends BaseLearningMaterialModel {
    id: number;
}

export interface BaseLearningMaterialDocumentModel {
    id?: number;
    caption: string;
    document_file: BaseDocumentFileModel;
}

export function createDefaultLearningMaterialDocument(): BaseLearningMaterialDocumentModel {
    return {
        caption: '',
        document_file: {
            path: undefined,
            disk: 'public',
            file: undefined,
            __isOpened: false,
        },
    }
}
