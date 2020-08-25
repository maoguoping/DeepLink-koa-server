export default class Page {
    public name: string;
    public currentPage: number;
    public pageSize: number;
    public total: number;
    public list: any[];
    public listDescription: string;
    public constructor(name: string) {
      this.name = name;
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.list = [];
      this.listDescription = "";
    }
  }

  