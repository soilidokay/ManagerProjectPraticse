import { SolutionSchema } from "./SolutionSchema.js";

/**
* Athor: Unmatched Tai Nguyen - 04 /08 /2019 - 21 :56 :04 
*
*/
export class CrashIn {
    constructor(datas, TEnd) {
        this.TEnd = TEnd
        this.datas = datas

        this.dataSchemas = this.datas.map((item, index) => {
            item.cost = item.value.cost2 - item.value.cost1
            item.index = index
            return { value: item.value.v1, dependencies: item.dependencies, traces: [], Calculate: {}, index }
        })

        this.Schema = new SolutionSchema(this.dataSchemas)

        this.ResultTable = []
        this.Crashed = []
        this.LeadCrashs = [{ indexes: [], cost: 0 }]
        this.IndexActiveCrash = 0
    }

    Crash = (ArrayIndex) => {
        this.datas.forEach((item, index) => {
            this.dataSchemas[index].value = item.value.v1
            this.dataSchemas[index].Calculate = {}
        })
        ArrayIndex.forEach(item => {
            let dataSchema = this.dataSchemas[item]
            let data = this.datas[item]
            dataSchema.value = data.value.v2
        });
    }
    MinCalculate = (datas) => {
        if (datas.length < 1) return -1
        let indexMin = 0
        datas.forEach((item, index) => {
            if (item.cost < datas[indexMin].cost) {
                indexMin = index
            }
        })
        return indexMin
    }



    Run = () => {
        const { Schema } = this
        do {
            Schema.Run()

            let valueCalculateds = Schema.GetCalculates().filter(item => item.S == 0)

            if (valueCalculateds) {
                valueCalculateds = valueCalculateds.map(item => {
                    // const {index,cost} = this.datas[item.index]
                    return this.datas[item.index]
                })
            } else valueCalculateds = null

            let ActiveCrash = this.LeadCrashs.splice(this.IndexActiveCrash, 1)[0]
            const { indexes, cost } = ActiveCrash

            let NotCrash = []

            valueCalculateds.forEach(item => {
                let { value } = this.datas[item.index]
                if (indexes.find(x => x == item.index) == undefined && value.v1 != value.v2) NotCrash.push(item)
            })

            for (let item of NotCrash) {
                let TmpIndexes = [...indexes]
                TmpIndexes.push(item.index)
                TmpIndexes.sort()
                if (!this.LeadCrashs.find(x => {
                    return x.indexes.toString() == TmpIndexes.toString()
                })) {
                    this.LeadCrashs.push({ index: item.index, indexes: TmpIndexes, cost: cost + item.cost })
                }
            }
            const { ResultTable } = this

            // console.log(ActiveCrash.indexes.map(item => String.fromCharCode(item + 65)), NotCrash.map(item => String.fromCharCode(item.index + 65)), this.LeadCrashs.map(item => item.indexes.map(x => String.fromCharCode(x + 65)).toString()))
            ResultTable.push({
                RootCrash: ActiveCrash.indexes.map(item => String.fromCharCode(item + 65)),
                cost: cost,
                TEnd: Schema.getTLMax(),
                Nexts: NotCrash.map(item => String.fromCharCode(item.index + 65))
            })

            this.IndexActiveCrash = this.MinCalculate(this.LeadCrashs)

            let NewActiveCrash = this.LeadCrashs[this.IndexActiveCrash]
            if (!NewActiveCrash) break

            this.Crashed[NewActiveCrash.index] = true
            this.Crash(NewActiveCrash.indexes)
        } while (Schema.getTLMax() > this.TEnd)

        console.log(this.ResultTable)

        return this.ResultTable

    }
}