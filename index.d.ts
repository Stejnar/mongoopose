declare class Parameters<T> {
    as: object;
    select: object;
    query: object;
    save: object;
    result: T;

    add(result: object, name: string): Parameters<any>
    assign(obj: object): Parameters<any>
    toError(error): Error
}

type Pipe = (params: Parameters<any>) => Parameters<any>;

type Functor = (query?: (params: Parameters<any>) => Parameters<any>) =>
    (pipe: Parameters<any>) =>
        Promise<Parameters<any>>;

type Action = (
    resolve: (params: Parameters<any>) => void,
    reject: (err: Error) => void,
    params: Parameters<any>
) => void;

type Pipeline = (
    action: (
        resolve: (params: Parameters<any>) => void,
        reject: (err: Error) => void,
        params: Parameters<any>) => void
) => (pipe: Parameters<any>) => Promise<Parameters<any>>;

declare class Model {
    findById: Functor;
    findOne: Functor;
    find: Functor;
    update: Functor;
    save: Functor;
    pipe: Pipeline;
}

declare module 'stejnar__mongoopose' {
    import mongoose from 'mongoose';

    export function model(model: mongoose.Model<any>): Model;

    export function compose(funcs: Functor[] | Pipeline[]): (params: Parameters<any>) => Promise<Parameters<any>>;

    export function Params(obj?: object): Parameters<any>;
}