/**
* Athor: Unmatched Tai Nguyen - 04 /08 /2019 - 21 :22 :26 
*
*/
export class SolutionSchema {
    constructor(datas) {
        this.datas = datas
        this.datas.forEach((element, index) => {
            element.dependencies.forEach(item => {
                this.datas[item].traces.push(index)
            })
        });
        //loc cac goc dau tien
        this.RootNodes = this.datas.filter(x => x.dependencies.length == 0)
        //Loc cac lá
        this.Leadnodes = this.datas.filter(x => x.traces.length == 0)
    }

    setValues = (datas)=>{
        this.datas = datas
    }
    
    UpdateTE = (data) => {
        if (data.traces.length < 1) return
        data.traces.forEach((item) => {
            let TE = this.datas[item].value + data.Calculate.TE
            if (TE > (this.datas[item].Calculate.TE || 0)) this.datas[item].Calculate.TE = TE
            this.UpdateTE(this.datas[item])
        });
    }

    UpdateTL = (data) => {
        if (data.dependencies.length < 1) return

        let TE2 = data.Calculate.TL - data.value

        data.dependencies.forEach(index => {
            if (!this.datas[index].Calculate.TL || this.datas[index].Calculate.TL > TE2) {
                this.datas[index].Calculate.TL = TE2
                this.datas[index].Calculate.S = TE2 - this.datas[index].Calculate.TE
                this.UpdateTL(this.datas[index])
            }
        });
    }
    getTLMax = ()=>{
        return this.MaxTE
    }
    GetCalculates = ()=>{
        return this.datas.map(x=>{
            let Tmp = {...x.Calculate}
            Tmp.index = x.index
            return Tmp
        })
    }
    Run = () => {
        //de quy update TE
        this.RootNodes.forEach(data => {
            if (data.dependencies.length < 1) data.Calculate.TE = data.value
            this.UpdateTE(data)
        })

        this.MaxTE = this.Leadnodes[0].Calculate.TE
        this.Leadnodes.forEach(element => {
            if (this.MaxTE < element.Calculate.TE) this.MaxTE = element.Calculate.TE
        });

        //goi de quy update TL và tính S
        this.Leadnodes.forEach(element => {
            element.Calculate.TL = this.MaxTE
            element.Calculate.S = this.MaxTE - element.Calculate.TE
            this.UpdateTL(element)
        });
    }
}
