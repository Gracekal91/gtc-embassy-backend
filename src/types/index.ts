declare module Express{
    export interface Request{
        user?: any
    }
}

declare module JwtPayload{
    export interface decoded{
        name?: any
    }
}