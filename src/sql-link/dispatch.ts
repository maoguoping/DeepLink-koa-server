interface Reducer {
    (...res: any[]) : any
}
export interface DispatchProps {
    name: string,
    reducer?: Reducer,
    param?: any
}
export class Dispatch {
    public name: string;
    public reducer: Reducer;
    public param: any;
    public isFn: boolean;
    constructor (params: DispatchProps) {
        this.name = params.name;
        this.reducer = params.reducer;
        this.isFn = true;
        this.param = params.param;
    }    
}