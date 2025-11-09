interface BaseResponse<T> extends PageInfo {
    data?: T,
    success?: boolean,
    message?: string,
    error?: string,
    statusCode?: number,


}
interface PageInfo {
    currentPage?: number,
    pageSize?: number,
    totalCount?: number,
    totalPages?: number
}