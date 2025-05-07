const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payRunListSchema = new Schema({

    department: {
        type: String,
        required: false,
    },
    from: {
        type: String,
        required: false,
    },
    to: {
        type: String,
        required: false,
    },
    empcount: {
        type: String,
        required: false,
    },
    totalctc: {
        type: String,
        required: false,
    },
    totalpf: {
        type: String,
        required: false,
    },

    totalesi: {
        type: String,
        required: false,
    },
    totalproftax: {
        type: String,
        required: false,
    },
    generatedon: {
        type: String,
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    year: {
        type: String,
        required: false,
    },

    data: [
        {
            company: {
                type: String,
                required: false,
            },
            branch: {
                type: String,
                required: false,
            },
            unit: {
                type: String,
                required: false,
            },
            team: {
                type: String,
                required: false,
            },
            empcode: {
                type: String,
                required: false,
            },
            companyname: {
                type: String,
                required: false,
            },
            department: {
                type: String,
                required: false,
            },
            legalname: {
                type: String,
                required: false,
            },
            doj: {
                type: String,
                required: false,
            },
            designation: {
                type: String,
                required: false,
            },
            processcodeexp: {
                type: String,
                required: false,
            },
            experience: {
                type: String,
                required: false,
            },

            bankname: {
                type: String,
                required: false,
            },
            accountholdername: {
                type: String,
                required: false,
            },
            accountnumber: {
                type: String,
                required: false,
            },
            ifsccode: {
                type: String,
                required: false,
            },
            totalnumberofdays: {
                type: String,
                required: false,
            },
            totalshift: {
                type: String,
                required: false,
            },
            clsl: {
                type: String,
                required: false,
            },
            weekoffcount: {
                type: String,
                required: false,
            },
            holiday: {
                type: String,
                required: false,
            },
            totalasbleave: {
                type: String,
                required: false,
            },
            totalpaidDays: {
                type: String,
                required: false,
            },
            calcualted: {
                type: String,
                required: false,
            },

            oldgross: {
                type: String,
                required: false,
            },
            oldbasic: {
                type: String,
                required: false,
            },
            oldhra: {
                type: String,
                required: false,
            },
            oldconveyance: {
                type: String,
                required: false,
            },
            oldmedicalallowance: {
                type: String,
                required: false,
            },
            oldproductionallowance: {
                type: String,
                required: false,
            },
            oldproductionallowancetwo: {
                type: String,
                required: false,
            },
            oldotherallowance: {
                type: String,
                required: false,
            },
            gross: {
                type: String,
                required: false,
            },

            newgross: {
                type: String,
                required: false,
            },
            basic: {
                type: String,
                required: false,
            },
            hra: {
                type: String,
                required: false,
            },
            conveyance: {
                type: String,
                required: false,
            },
            medicalallowance: {
                type: String,
                required: false,
            },
            productionallowance: {
                type: String,
                required: false,
            },
            productionallowancetwo: {
                type: String,
                required: false,
            },
            otherallowance: {
                type: String,
                required: false,
            },
            targetpoints: {
                type: String,
                required: false,
            },
            acheivedpoints: {
                type: String,
                required: false,
            },
            editedacheivedpoints: {
                type: String,
                required: false,
            },
            iseditedacheivedpoints: {
                type: String,
                required: false,
            },
            acheivedpercent: {
                type: String,
                required: false,
            },

            penalty: {
                type: String,
                required: false,
            },
            penaltyamount: {
                type: String,
                required: false,
            },
            editedpenaltyamount: {
                type: String,
                required: false,
            },
            iseditedpenaltyamount: {
                type: String,
                required: false,
            },
            uan: {
                type: String,
                required: false,
            },
            pfmembername: {
                type: String,
                required: false,
            },
            insurancenumber: {
                type: String,
                required: false,
            },
            ipname: {
                type: String,
                required: false,
            },
            noallowancepoint: {
                type: String,
                required: false,
            },
            allowancepoint: {
                type: String,
                required: false,
            },

            shiftallowancetarget: {
                type: String,
                required: false,
            },
            nightshiftallowance: {
                type: String,
                required: false,
            },

            eramount: {
                type: String,
                required: false,
            },

            revenueallow: {
                type: String,
                required: false,
            },
            shortage: {
                type: String,
                required: false,
            },

            endtar: {
                type: String,
                required: false,
            },
            endtardate: {
                type: String,
                required: false,
            },
            endexp: {
                type: String,
                required: false,
            },
            endexpdate: {
                type: String,
                required: false,
            },

            assignExpMode: {
                type: String,
                required: false,
            },

            modevalue: {
                type: String,
                required: false,
            },

            targetexp: {
                type: String,
                required: false,
            },
            prodexp: {
                type: String,
                required: false,
            },
            modeexp: {
                type: String,
                required: false,
            },
            processcode: {
                type: String,
                required: false,
            },

            processcodetar: {
                type: String,
                required: false,
            },

            salexp: {
                type: String,
                required: false,
            },

            monthPoint: {
                type: String,
                required: false,
            },
            dayPoint: {
                type: String,
                required: false,
            },



            currentmonthavg: {
                type: String,
                required: false,
            },
            currentmonthattendance: {
                type: String,
                required: false,
            },
            paidstatus: {
                type: String,
                required: false,
            },

            //logs and value
            totalpaiddayslog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            totalpaiddaycalVal1: {
                type: String,
                required: false,
            },

            totalabsentlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            totalabsentcalVal1: {
                type: String,
                required: false,
            },

            penaltylog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            penaltyCalVal1: {
                type: String,
                required: false,
            },

            targetpointlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            targetpointCalVal1: {
                type: String,
                required: false,
            },

            acheivedpointlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            acheivedpointCalVal1: {
                type: String,
                required: false,
            },

            shiftallowancelog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            shiftallowanceCalVal1: {
                type: String,
                required: false,
            },

            currmonthavglog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            currentmonthavgCalVal1: {
                type: String,
                required: false,
            },

            currmonthattlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            currentmonthattCalVal1: {
                type: String,
                required: false,
            },

            noshiftlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            noshiftlogCalVal1: {
                type: String,
                required: false,
            },


            shiftallowtargetlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            shiftallowtargetlogCalVal1: {
                type: String,
                required: false,
            },


            nightshiftallowlog: [
                {
                    date: {
                        type: String,
                        required: false,
                    },
                    month: {
                        type: String,
                        required: false,
                    },
                    year: {
                        type: String,
                        required: false,
                    },
                    value: {
                        type: String,
                        required: false,
                    },

                }
            ],
            nightshiftallowlogCalVal1: {
                type: String,
                required: false,
            },

            acheivedproductionallowance: {
                type: String,
                required: false,
            },
            attendancelop: {
                type: String,
                required: false,
            },
            actualnetsalary: {
                type: String,
                required: false,
            },
            lopbasic: {
                type: String,
                required: false,
            },
            lophra: {
                type: String,
                required: false,
            },
            lopconveyance: {
                type: String,
                required: false,
            },
            lopmedicalallowance: {
                type: String,
                required: false,
            },
            lopotherallowance: {
                type: String,
                required: false,
            },
            lopproductionallowance: {
                type: String,
                required: false,
            },
            lopnetsalary: {
                type: String,
                required: false,
            },
            prodbasic: {
                type: String,
                required: false,
            },
            prodhra: {
                type: String,
                required: false,
            },
            prodconveyance: {
                type: String,
                required: false,
            },
            prodmedicalallowance: {
                type: String,
                required: false,
            },
            prodotherallowance: {
                type: String,
                required: false,
            },
            prodproductionallowance: {
                type: String,
                required: false,
            },
            calculatednetsalary: {
                type: String,
                required: false,
            },
            lossdeduction: {
                type: String,
                required: false,
            },
            otherdeduction: {
                type: String,
                required: false,
            },
            finalbasic: {
                type: String,
                required: false,
            },
            finalhra: {
                type: String,
                required: false,
            },
            finalconveyance: {
                type: String,
                required: false,
            },
            finalmedicalallowance: {
                type: String,
                required: false,
            },
            finalproductionallowance: {
                type: String,
                required: false,
            },
            finalotherallowance: {
                type: String,
                required: false,
            },
            finalnetsalary: {
                type: String,
                required: false,
            },
            pfdays: {
                type: String,
                required: false,
            },
            ncpdays: {
                type: String,
                required: false,
            },
            pfdeduction: {
                type: String,
                required: false,
            },
            esideduction: {
                type: String,
                required: false,
            },
            finallopdays: {
                type: String,
                required: false,
            },
            paysliplop: {
                type: String,
                required: false,
            },
            finalleavededuction: {
                type: String,
                required: false,
            },
            professionaltax: {
                type: String,
                required: false,
            },
            totaldeductions: {
                type: String,
                required: false,
            },
            shiftallowancetarget: {
                type: String,
                required: false,
            },
            nightshiftallowance: {
                type: String,
                required: false,
            },
            finalsalary: {
                type: String,
                required: false,
            },
            finalsalarypenalty: {
                type: String,
                required: false,
            },
            totalpointsvalue: {
                type: String,
                required: false,
            },
            era: {
                type: String,
                required: false,
            },
            pfemployerdeduction: {
                type: String,
                required: false,
            },
            esiemployerdeduction: {
                type: String,
                required: false,
            },
            ctc: {
                type: String,
                required: false,
            },

            finalvalue: {
                type: String,
                required: false,
            },
            finalvaluepenalty: {
                type: String,
                required: false,
            },
            shortageone: {
                type: String,
                required: false,
            },
            actualdeduction: {
                type: String,
                required: false,
            },
            minimumdeduction: {
                type: String,
                required: false,
            },
            finalvaluereview: {
                type: String,
                required: false,
            },
            finalvaluestatus: {
                type: String,
                required: false,
            },
            finalvaluepenaltystatus: {
                type: String,
                required: false,
            },


            //FIXED
            fixedlossdeduction: {
                type: String,
                required: false,
            },
            fixednetsalary: {
                type: String,
                required: false,
            },
            fixedbasic: {
                type: String,
                required: false,
            },
            fixedhra: {
                type: String,
                required: false,
            },
            fixedconveyance: {
                type: String,
                required: false,
            },
            fixedmedicalallowance: {
                type: String,
                required: false,
            },
            fixedproductionallowance: {
                type: String,
                required: false,
            },
            fixedotherallowance: {
                type: String,
                required: false,
            },
            fixednetsalaryone: {
                type: String,
                required: false,
            },
            fixedemppf: {
                type: String,
                required: false,
            },
            fixedempesi: {
                type: String,
                required: false,
            },
            fixedempptax: {
                type: String,
                required: false,
            },
            fixedemprpf: {
                type: String,
                required: false,
            },
            fixedempresi: {
                type: String,
                required: false,
            },
            fixedshiftallowance: {
                type: String,
                required: false,
            },
            fixedtotaldeductions: {
                type: String,
                required: false,
            },
            fixedsalary: {
                type: String,
                required: false,
            },
            fixedsalarypenalty: {
                type: String,
                required: false,
            },
            fixedlop: {
                type: String,
                required: false,
            },
            fixedlopdays: {
                type: String,
                required: false,
            },
            fixedctc: {
                type: String,
                required: false,
            },
            fixedfinalvalue: {
                type: String,
                required: false,
            },
            fixedleavededuction: {
                type: String,
                required: false,
            },
            fixedactualdeduction: {
                type: String,
                required: false,
            },
            fixedminimumdeduction: {
                type: String,
                required: false,
            },

            // production
            prodlossdeduction: {
                type: String,
                required: false,
            },
            prodnetsalary: {
                type: String,
                required: false,
            },
            prodbasicp: {
                type: String,
                required: false,
            },
            prodhrap: {
                type: String,
                required: false,
            },
            prodconveyancep: {
                type: String,
                required: false,
            },
            prodmedicalallowancep: {
                type: String,
                required: false,
            },
            prodproductionallowancep: {
                type: String,
                required: false,
            },
            prodotherallowancep: {
                type: String,
                required: false,
            },
            prodnetsalaryonep: {
                type: String,
                required: false,
            },
            prodemppf: {
                type: String,
                required: false,
            },
            prodempesi: {
                type: String,
                required: false,
            },
            prodempptax: {
                type: String,
                required: false,
            },
            prodemprpf: {
                type: String,
                required: false,
            },
            prodempresi: {
                type: String,
                required: false,
            },
            prodtotaldeductions: {
                type: String,
                required: false,
            },
            prodshiftallowance: {
                type: String,
                required: false,
            },
            prodsalary: {
                type: String,
                required: false,
            },
            prodsalarypenalty: {
                type: String,
                required: false,
            },
            prodlopdays: {
                type: String,
                required: false,
            },
            prodlop: {
                type: String,
                required: false,
            },
            prodleavededuction: {
                type: String,
                required: false,
            },
            prodctc: {
                type: String,
                required: false,
            },
            prodfinalvalue: {
                type: String,
                required: false,
            },
            prodactualdeduction: {
                type: String,
                required: false,
            },
            prodminimumdeduction: {
                type: String,
                required: false,
            },

            currentmonthavg: {
                type: String,
                required: false,
            },
            currentmonthattendance: {
                type: String,
                required: false,
            },

            paidstatus: {
                type: String,
                required: false,
            },
            paydate: {
                type: String,
                required: false,
            },
            payonsalarytype: {
                type: String,
                required: false,
            },
            salarytype: {
                type: String,
                required: false,
            },
            deductiontype: {
                type: String,
                required: false,
            },
            monthfromdate: {
                type: String,
                required: false,
            },
            monthenddate: {
                type: String,
                required: false,
            },
            waiver: {
                type: String,
                required: false,
            },
            lossdeductionfinal: {
                type: String,
                required: false,
            },
            otherdeductionfinal: {
                type: String,
                required: false,
            },
            lossdeductionischanged: {
                type: String,
                required: false,
            },
            salarytypefinal: {
                type: String,
                required: false,
            },
            deductiontypefinal: {
                type: String,
                required: false,
            },
            payrunstatuschange: {
                type: String,
                required: false,
            },
            sentfixsalary: {
                type: String,
                required: false,
            },
            updatedpaidstatus: {
                type: String,
                required: false,
            },
            updatechangedate: {
                type: String,
                required: false,
            },
            updatedholdpercent: {
                type: [String],
                required: false,
            },

            logdata: [
                {
                    status: {
                        type: String,
                        required: false
                    },
                    bankreleasestatus: {
                        type: String,
                        required: false
                    },
                    bankclose: {
                        type: String,
                        required: false
                    },
                    statuspage: {
                        type: String,
                        required: false
                    },
                    holdsalaryconfirm: {
                        type: String,
                        required: false
                    },
                    holdsalaryconfirmfinal: {
                        type: String,
                        required: false
                    },
                    matchid: {
                        type: String,
                        required: false
                    },
                    rejectreason: {
                        type: String,
                        required: false
                    },
                    holdreleaseconfirm: {
                        type: String,
                        required: false
                    },
                    companyname: {
                        type: String,
                        required: false
                    },
                    innerId: {
                        type: String,
                        required: false
                    },
                    outerId: {
                        type: String,
                        required: false
                    },
                    company: {
                        type: String,
                        required: false
                    },
                    branch: {
                        type: String,
                        required: false
                    },
                    unit: {
                        type: String,
                        required: false
                    },
                    empcode: {
                        type: String,
                        required: false
                    },
                    legalname: {
                        type: String,
                        required: false
                    },
                    designation: {
                        type: String,
                        required: false
                    },

                    team: {
                        type: String,
                        required: false
                    },
                    department: {
                        type: String,
                        required: false
                    },

                    totalnumberofdays: {
                        type: String,
                        required: false,
                    },
                    totalshift: {
                        type: String,
                        required: false,
                    },

                    totalasbleave: {
                        type: String,
                        required: false,
                    },
                    totalpaidDays: {
                        type: String,
                        required: false,
                    },
                    targetpoints: {
                        type: String,
                        required: false,
                    },
                    clsl: {
                        type: String,
                        required: false,
                    },
                    acheivedpoints: {
                        type: String,
                        required: false,
                    },

                    acheivedpercent: {
                        type: String,
                        required: false,
                    },
                    currentmonthavg: {
                        type: String,
                        required: false,
                    },
                    currentmonthattendance: {
                        type: String,
                        required: false,
                    },
                    bankname: {
                        type: String,
                        required: false
                    },
                    accountholdername: {
                        type: String,
                        required: false,
                    },

                    accountnumber: {
                        type: String,
                        required: false
                    },
                    ifsccode: {
                        type: String,
                        required: false
                    },
                    penaltyamount: {
                        type: String,
                        required: false,
                    },
                    releaseamount: {
                        type: String,
                        required: false
                    },
                    otherdeductionamount: {
                        type: String,
                        required: false
                    },
                    totalexcess: {
                        type: String,
                        required: false
                    },
                    totaladvance: {
                        type: String,
                        required: false
                    },
                    payamount: {
                        type: String,
                        required: false
                    },
                    balanceamount: {
                        type: String,
                        required: false
                    },
                    paidstatus: {
                        type: String,
                        required: false
                    },
                    approvedby: {
                        type: String,
                        required: false
                    },
                    description: {
                        type: String,
                        required: false
                    },
                    recheckreason: {
                        type: String,
                        required: false
                    },
                    updatedpaidstatus: {
                        type: String,
                        required: false
                    },
                    updatechangedate: {
                        type: String,
                        required: false
                    },
                    updatedholdpercent: {
                        type: String,
                        required: false
                    },
                    updatedreason: {
                        type: String,
                        required: false
                    },
                    updatedholdreason: {
                        type: String,
                        required: false,
                    },
                    payonsalarytype: {
                        type: String,
                        required: false
                    },
                    paymonth: {
                        type: String,
                        required: false
                    },
                    payyear: {
                        type: String,
                        required: false
                    },
                    paydate: {
                        type: String,
                        required: false
                    },
                    finalusersalary: {
                        type: String,
                        required: false
                    },
                    fixholdconfirm: {
                        type: String,
                        required: false
                    },
                }
            ],

            updatedreason: {
                type: String,
                required: false,
            },
            updatedholdreason: {
                type: String,
                required: false,
            },
            fixsalarydateconfirm: {
                type: String,
                required: false,
            },
            differamount: {
                type: String,
                required: false,
            },
            changestatus: {
                type: String,
                required: false,
            },
            finalusersalary: {
                type: String,
                required: false,
            },
            fixholdsalarydateconfirm: {
                type: String,
                required: false,
            },


        }
    ],

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },
        },
    ],
    updatedby: [
        {
            name: {
                type: String,
                required: false,
            },
            date: {
                type: String,
                required: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

});
module.exports = mongoose.model("payrunlist", payRunListSchema);