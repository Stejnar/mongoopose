declare class Params<T> {
    as: object;
    select: object;
    query: object;
    save: object;
    result: T;

    add(result: object, name: string): Params<any>
    assign(obj: object): Params<any>
    toError(error): Error
}

type Pipe = (params: Params<any>) => Params<any>;

type Functor = (query?: (params: Params<any>) => Params<any>) =>
    (pipe: Params<any>) =>
        Promise<Params<any>>;

type Action = (
    resolve: (params: Params<any>) => void,
    reject: (err: Error) => void,
    params: Params<any>
) => void;

type Pipeline = (
    action: (
        resolve: (params: Params<any>) => void,
        reject: (err: Error) => void,
        params: Params<any>) => void
) => (pipe: Params<any>) => Promise<Params<any>>;

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

    export function compose(funcs: Functor[] | Pipeline[]): (params: Params<any>) => Promise<Params<any>>;

    export function Params(obj?: object): Params<any>;
}