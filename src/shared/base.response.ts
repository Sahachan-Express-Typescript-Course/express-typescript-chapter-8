export class ResponseDto<T> {
    data?: T | null = null;
    message?: string = 'success';
    status?: number = 200;
    timestamp?: Date = new Date();

    constructor(init?: Partial<ResponseDto<T>>) {
        Object.assign(this, init);
    }
}
