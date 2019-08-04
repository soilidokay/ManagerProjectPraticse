import { CrashIn } from "../Processings/CrashIn.js";




let btnAdd = document.getElementById('btnadd')
btnAdd.addEventListener('click', (e) => {
    let divContainer = document.getElementsByClassName('inputcontainer')[0]
    divContainer.innerHTML +=
        `<div class="inputvalue">
        <Lable> ${String.fromCharCode(divContainer.children.length + 65)} ${divContainer.children.length}</Lable>
        <input type="text">
        <input type="text">
        </div>`
})

// for (let index = 0; index < 5; index++) {
//     btnAdd.click()    
// }

let btnDel = document.getElementById('btndel')
btnDel.addEventListener('click', (e) => {
    let divContainer = document.getElementsByClassName('inputcontainer')[0]
    console.log(divContainer.children.length)
    if (divContainer.children.length > 1) {
        divContainer.removeChild(divContainer.children[divContainer.children.length - 1])
    }

})

let btnsolution = document.getElementById('btnsolution')
btnsolution.addEventListener('click', (e) => {
    let tmps1 = document.querySelectorAll('.inputvalue input:nth-child(2)')
    let tmps2 = document.querySelectorAll('.inputvalue input:nth-child(3)')
    let TEnd = document.getElementById('tda').value
    // let datas = [
    //     { value: { v1: 2, cost1: 20, v2: 1, cost2: 28 }, dependencies: [] },
    //     { value: { v1: 2, cost1: 40, v2: 1, cost2: 56 }, dependencies: [] },
    //     { value: { v1: 3, cost1: 10, v2: 2, cost2: 16 }, dependencies: [1] },
    //     { value: { v1: 1, cost1: 20, v2: 1, cost2: 20 }, dependencies: [] },
    //     { value: { v1: 5, cost1: 20, v2: 3, cost2: 34 }, dependencies: [1] },
    //     { value: { v1: 3, cost1: 30, v2: 1, cost2: 42 }, dependencies: [0, 2] },
    // ]
    let datas = []
    for (let index = 0; index < tmps1.length; index++) {
        const value1 = tmps1[index].value;
        const value2 = tmps2[index].value;
        let tvs1 =value1? value1.trim().split(','):[]
        let tvs2 = value2 ? value2.trim().split(',') : []
        let convertTvs2 = []
        for (let i = 0; i < tvs2.length; i++) {
            convertTvs2.push(+tvs2[i]);
        }
        datas.push({
            value: { v1: +tvs1[0], cost1: +tvs1[1], v2: +tvs1[2], cost2: +tvs1[3] }, dependencies: convertTvs2
        })
    }

    // console.log(datas)

    let crash = new CrashIn(datas,+TEnd)
    let Result = crash.Run()

    let tableresult = document.getElementById('tableresult');

    let HtmlTable = ''
    Result.forEach((item) => {
        HtmlTable +=
            `<tr>
            <td>${item.RootCrash.toString()}</td>
            <td>${item.cost}</td>
            <td>${item.TEnd}</td>
            <td>${item.Nexts}</td>
        </tr>`
    })
    tableresult.innerHTML = HtmlTable;

})


