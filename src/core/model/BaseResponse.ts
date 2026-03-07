export interface BaseResponse<T> extends PageInfo {
    data?: T,
    success?: boolean,
    message?: string,
    error?: string,
    statusCode?: number,


}
export interface PageInfo {
    currentPage?: number,
    pageSize?: number,
    totalCount?: number,
    totalPages?: number
}
