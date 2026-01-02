export interface Action extends BaseModel {
    path?: string;
    method?: string;
    allowAnonymous?: boolean;

}