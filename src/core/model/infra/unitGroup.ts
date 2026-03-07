// UnitGroup corresponds to UnitGroupDTO returned by the backend.  Only a
// subset of fields are usually needed on the frontend.
//
// Follow the existing pattern in other domains where models extend
// `BaseModel` for `id`, `createdAt` and `updatedAt`.
// `BaseModel` is declared globally in `src/core/model/BaseModel.ts` (no export)
// so other model files simply extend it without importing.
export interface UnitGroup extends BaseModel {
    name?: string;
    propertyId?: number;
}
