interface BaseResponse<T> {
    data?: T,
    success?: boolean,
    message?: string,
    error?: string,
    statusCode?: number

}