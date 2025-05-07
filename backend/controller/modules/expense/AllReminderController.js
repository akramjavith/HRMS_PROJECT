const ExpenseReminder = require("../../../model/modules/expense/ExpenseReminderModel");
const Expense = require("../../../model/modules/expense/expenses");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const SchedulePayment = require("../../../model/modules/account/otherpayment");
const moment = require("moment");

exports.getPaymentDueReminder = catchAsyncErrors(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const { vendorfrequency, filterdates, filteryear, assignbranch } = req.body;

    const branchFilterExpense = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    const branchFilterSchedulePayment = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
    }));

    if (vendorfrequency === "Daily") {
      // const expense = await Expense.find({
      //   $and: [
      //     { vendorfrequency: vendorfrequency },
      //     { duedate: { $exists: true, $ne: "" } },
      //     { duedate: { $eq: moment(currentDate).format("YYYY-MM-DD") } },
      //     {
      //       $or: [
      //         { billstatus: "InComplete" },
      //         { billstatus: "Partially Paid" },
      //       ],
      //     },
      //   ],
      // });

      const dateAndBillStatusFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          {
            $or: [
              {
                $and: [
                  {
                    duedate: { $exists: true, $ne: "" }, // duedate exists and is not empty
                    duedate: moment(filterdates, "YYYY-MM-DD").format(
                      "YYYY-MM-DD"
                    ), // duedate equals currentDate
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      { duedate: { $exists: false } }, // duedate field doesn't exist
                      { duedate: "" }, // duedate is empty
                    ],
                  },
                  {
                    date: moment(filterdates, "YYYY-MM-DD").format(
                      "YYYY-MM-DD"
                    ), // date equals currentDate
                  },
                ],
              },
            ],
          },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      };

      const filterQueryExpense = {
        $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilter],
      };

      const shcedulePaymentDailyFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { receiptdate: { $exists: true, $ne: "" } },
          {
            receiptdate: {
              $eq: moment(filterdates, "YYYY-MM-DD").format("YYYY-MM-DD"),
            },
          },
          { paidstatus: "Not Paid" },
        ],
      };

      const filterQuerySchedulePayment = {
        $and: [
          { $or: branchFilterSchedulePayment },
          shcedulePaymentDailyFilter,
        ],
      };

      const expense = await Expense.find(filterQueryExpense);

      const schedulePaymentData = await SchedulePayment.find(
        filterQuerySchedulePayment
      );

      const totalData = [...expense, ...schedulePaymentData];

      const finaldata = totalData.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          vendor:
            item?.vendorname == undefined ? item?.vendor : item?.vendorname,
          currdate:
            item?.duedate == undefined
              ? moment(item?.receiptdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : item?.duedate === ""
              ? moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
              : moment(item?.duedate, "YYYY-MM-DD").format("DD-MM-YYYY"),

          // currdate:
          //   item?.duedate == undefined
          //     ? moment(item?.receiptdate).format("DD-MM-YYYY")
          //     : moment(item?.duedate).format("DD-MM-YYYY"),
          vendorfrequency:
            item?.vendorfrequency == undefined
              ? item?.frequency
              : item?.vendorfrequency,
          amount:
            item?.billstatus == undefined
              ? item?.dueamount
              : item?.billstatus == "Partially Paid"
              ? item.balanceamount
              : item?.totalbillamount,
          source: item?.source,
          billno: item?.billno == undefined ? item?.referenceno : item?.billno,
          vendorid: item?.vendorid,
          filteredfrom: "Daily",
          filterdates: filterdates,
        };
      });

      return res.status(200).json({
        expensereminder: finaldata,
      });
    } else if (vendorfrequency === "Weekly") {
      if (filterdates === "") {
        const currentWeekStartDate = moment(currentDate, "YYYY-MM-DD")
          .startOf("week")
          .format("YYYY-MM-DD");
        const currentWeekEndDate = moment(currentDate, "YYYY-MM-DD")
          .endOf("week")
          .format("YYYY-MM-DD");

        //

        const dateAndBillStatusFilterOne = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { duedate: { $exists: true, $ne: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpenseOne = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterOne],
        };

        const dateAndBillStatusFilterTwo = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { duedate: { $exists: true, $eq: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpenseTwo = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterTwo],
        };

        const shcedulePaymentDailyFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { receiptdate: { $exists: true, $ne: "" } },
            { paidstatus: "Not Paid" },
          ],
        };

        const filterQuerySchedulePayment = {
          $and: [
            { $or: branchFilterSchedulePayment },
            shcedulePaymentDailyFilter,
          ],
        };

        //

        const expense = await Expense.find(filterQueryExpenseOne);

        const expensetwo = await Expense.find(filterQueryExpenseTwo);
        const updatedDataOne = expense.filter((tp) => {
          return moment(tp.duedate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });
        const updatedDataTwo = expensetwo.filter((tp) => {
          return moment(tp.date, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const schedulePaymentData = await SchedulePayment.find(
          filterQuerySchedulePayment
        );

        const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
          return moment(tp.receiptdate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const totalData = [
          ...updatedDataOne,
          ...updatedDataTwo,
          ...updatedDataScheduleOne,
        ];

        const finaldata = totalData.map((item, index) => {
          return {
            _id: item._id,
            serialNumber: index + 1,
            vendor:
              item?.vendorname == undefined ? item?.vendor : item?.vendorname,
            currdate:
              item?.duedate == undefined
                ? moment(item?.receiptdate, "YYYY-MM-DD").format("DD-MM-YYYY")
                : item?.duedate === ""
                ? moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
                : moment(item?.duedate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            vendorfrequency:
              item?.vendorfrequency == undefined
                ? item?.frequency
                : item?.vendorfrequency,
            amount:
              item?.billstatus == undefined
                ? item?.dueamount
                : item?.billstatus == "Partially Paid"
                ? item.balanceamount
                : item?.totalbillamount,
            source: item?.source,
            billno:
              item?.billno == undefined ? item?.referenceno : item?.billno,
            vendorid: item?.vendorid,
            filteredfrom: "Weekly",
            filterdates: filterdates,
          };
        });

        return res.status(200).json({
          expensereminder: finaldata,
        });
      } else {
        const currentWeekStartDate = filterdates;
        const currentWeekEndDate = moment(filterdates, "YYYY-MM-DD")
          .add(6, "days")
          .format("YYYY-MM-DD");

        //

        const dateAndBillStatusFilterOne = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { duedate: { $exists: true, $ne: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpenseOne = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterOne],
        };

        const dateAndBillStatusFilterTwo = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { duedate: { $exists: true, $eq: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpenseTwo = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterTwo],
        };

        const shcedulePaymentDailyFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { receiptdate: { $exists: true, $ne: "" } },
            { paidstatus: "Not Paid" },
          ],
        };

        const filterQuerySchedulePayment = {
          $and: [
            { $or: branchFilterSchedulePayment },
            shcedulePaymentDailyFilter,
          ],
        };

        //

        const expense = await Expense.find(filterQueryExpenseOne);

        const expensetwo = await Expense.find(filterQueryExpenseTwo);
        const updatedDataOne = expense.filter((tp) => {
          return moment(tp.duedate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });
        const updatedDataTwo = expensetwo.filter((tp) => {
          return moment(tp.date, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const schedulePaymentData = await SchedulePayment.find(
          filterQuerySchedulePayment
        );

        const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
          return moment(tp.receiptdate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const totalData = [
          ...updatedDataOne,
          ...updatedDataTwo,
          ...updatedDataScheduleOne,
        ];

        const finaldata = totalData.map((item, index) => {
          return {
            _id: item._id,
            serialNumber: index + 1,
            vendor:
              item?.vendorname == undefined ? item?.vendor : item?.vendorname,
            currdate:
              item?.duedate == undefined
                ? moment(item?.receiptdate, "YYYY-MM-DD").format("DD-MM-YYYY")
                : item?.duedate === ""
                ? moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
                : moment(item?.duedate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            vendorfrequency:
              item?.vendorfrequency == undefined
                ? item?.frequency
                : item?.vendorfrequency,
            amount:
              item?.billstatus == undefined
                ? item?.dueamount
                : item?.billstatus == "Partially Paid"
                ? item.balanceamount
                : item?.totalbillamount,
            source: item?.source,
            billno:
              item?.billno == undefined ? item?.referenceno : item?.billno,
            vendorid: item?.vendorid,
            filteredfrom: "Weekly",
            filterdates: filterdates,
          };
        });

        return res.status(200).json({
          expensereminder: finaldata,
        });
      }
    } else if (vendorfrequency === "Monthly") {
      const dateAndBillStatusFilterOne = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { duedate: { $exists: true, $ne: "" } },
          // { duedate: { $lte: moment(currentDate).format("YYYY-MM-DD") } },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      };

      const filterQueryExpenseOne = {
        $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterOne],
      };

      const dateAndBillStatusFilterTwo = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { duedate: { $exists: true, $eq: "" } },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      };

      const filterQueryExpenseTwo = {
        $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilterTwo],
      };

      const shcedulePaymentDailyFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { receiptdate: { $exists: true, $ne: "" } },
          // { receiptdate: { $eq: moment(currentDate).format("YYYY-MM-DD") } },
          { paidstatus: "Not Paid" },
        ],
      };

      const filterQuerySchedulePayment = {
        $and: [
          { $or: branchFilterSchedulePayment },
          shcedulePaymentDailyFilter,
        ],
      };

      const expense = await Expense.find(filterQueryExpenseOne);

      const expensetwo = await Expense.find(filterQueryExpenseTwo);
      const updatedDataOne = expense.filter((tp) => {
        const expenseMonth = moment(tp.duedate, "YYYY-MM-DD").format("MM");
        const expenseYear = moment(tp.duedate, "YYYY-MM-DD").format("YYYY");
        return expenseMonth === filterdates && expenseYear === filteryear;
      });

      // const updatedDataTwo = expensetwo
      //   .map((tp) => {
      //     tp.date = moment(tp.date, "YYYY-MM-DD")
      //       .add(1, "months")
      //       .format("YYYY-MM-DD");
      //     return tp;
      //   })
      //   .filter((tp) => {
      //     return moment(currentDate, "YYYY-MM-DD").isSameOrBefore(
      //       tp.date,
      //       "day"
      //     );
      //   });

      const updatedDataTwo = expensetwo.filter((tp) => {
        const expenseMonth = moment(tp.date, "YYYY-MM-DD").format("MM");
        const expenseYear = moment(tp.date, "YYYY-MM-DD").format("YYYY");
        return expenseMonth === filterdates && expenseYear === filteryear;
      });

      const schedulePaymentData = await SchedulePayment.find(
        filterQuerySchedulePayment
      );

      const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
        const expenseMonth = moment(tp.receiptdate, "YYYY-MM-DD").format("MM");
        const expenseYear = moment(tp.receiptdate, "YYYY-MM-DD").format("YYYY");
        return expenseMonth === filterdates && expenseYear === filteryear;
      });

      const totalData = [
        ...updatedDataOne,
        ...updatedDataTwo,
        ...updatedDataScheduleOne,
      ];

      const finaldata = totalData.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          vendor:
            item?.vendorname == undefined ? item?.vendor : item?.vendorname,
          currdate:
            item?.duedate == undefined
              ? moment(item?.receiptdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : item?.duedate === ""
              ? moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
              : moment(item?.duedate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          vendorfrequency:
            item?.vendorfrequency == undefined
              ? item?.frequency
              : item?.vendorfrequency,
          amount:
            item?.billstatus == undefined
              ? item?.dueamount
              : item?.billstatus == "Partially Paid"
              ? item.balanceamount
              : item?.totalbillamount,
          source: item?.source,
          billno: item?.billno == undefined ? item?.referenceno : item?.billno,
          vendorid: item?.vendorid,
          filteredfrom: "Monthly",
          filterdates: filterdates,
          filteryear: filteryear,
        };
      });

      return res.status(200).json({
        expensereminder: finaldata,
      });
    } else if (vendorfrequency === "BillWise") {
      // const expense = await Expense.find({
      //   $and: [
      //     // { vendorfrequency: vendorfrequency },
      //     { duedate: { $exists: true, $ne: "" } },
      //     { duedate: { $eq: moment(currentDate).format("YYYY-MM-DD") } },
      //     {
      //       $or: [
      //         { billstatus: "InComplete" },
      //         { billstatus: "Partially Paid" },
      //       ],
      //     },
      //   ],
      // });

      const expense = await Expense.find({
        $and: [
          // { vendorfrequency: vendorfrequency },
          {
            $or: [
              {
                $and: [
                  {
                    duedate: { $exists: true, $ne: "" }, // duedate exists and is not empty
                    duedate: moment(currentDate, "YYYY-MM-DD").format(
                      "YYYY-MM-DD"
                    ), // duedate equals currentDate
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      { duedate: { $exists: false } }, // duedate field doesn't exist
                      { duedate: "" }, // duedate is empty
                    ],
                  },
                  {
                    date: moment(currentDate, "YYYY-MM-DD").format(
                      "YYYY-MM-DD"
                    ), // date equals currentDate
                  },
                ],
              },
            ],
          },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      });

      const schedulePaymentData = await SchedulePayment.find({
        $and: [
          // { vendorfrequency: vendorfrequency },
          { receiptdate: { $exists: true, $ne: "" } },
          {
            receiptdate: {
              $eq: moment(currentDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            },
          },
          { paidstatus: "Not Paid" },
        ],
      });

      const totalData = [...expense, ...schedulePaymentData];

      const finaldata = totalData.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          vendor:
            item?.vendorname == undefined ? item?.vendor : item?.vendorname,
          // currdate:
          //   item?.duedate == undefined
          //     ? moment(item?.receiptdate).format("DD-MM-YYYY")
          //     : moment(item?.duedate).format("DD-MM-YYYY"),
          currdate:
            item?.duedate == undefined
              ? moment(item?.receiptdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : item?.duedate === ""
              ? moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY")
              : moment(item?.duedate, "YYYY-MM-DD").format("DD-MM-YYYY"),

          vendorfrequency:
            item?.vendorfrequency == undefined
              ? item?.frequency
              : item?.vendorfrequency,
          amount:
            item?.billstatus == undefined
              ? item?.dueamount
              : item?.billstatus == "Partially Paid"
              ? item.balanceamount
              : item?.totalbillamount,
          source: item?.source,
          billno: item?.billno == undefined ? item?.referenceno : item?.billno,
          vendorid: item?.vendorid,
          filteredfrom: "BillWise",
          filterdates: filterdates,
        };
      });

      return res.status(200).json({
        expensereminder: finaldata,
      });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllReminder = catchAsyncErrors(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const { vendorfrequency, filterdates, filteryear, assignbranch } = req.body;

    const branchFilterExpense = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    const branchFilterSchedulePayment = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
    }));

    if (vendorfrequency === "Daily") {
      const dateAndBillStatusFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { date: { $exists: true, $ne: "" } },
          { date: { $eq: moment(filterdates).format("YYYY-MM-DD") } },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      };

      const filterQueryExpense = {
        $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilter],
      };

      const shcedulePaymentDailyFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          {
            billdate: { $exists: true, $ne: "" },
          },
          {
            billdate: {
              $eq: moment(filterdates, "YYYY-MM-DD").format("YYYY-MM-DD"),
            },
          },
          { paidstatus: "Not Paid" },
        ],
      };

      const filterQuerySchedulePayment = {
        $and: [
          { $or: branchFilterSchedulePayment },
          shcedulePaymentDailyFilter,
        ],
      };

      const expense = await Expense.find(filterQueryExpense);

      const schedulePaymentData = await SchedulePayment.find(
        filterQuerySchedulePayment
      );

      const totalData = [...expense, ...schedulePaymentData];

      const finaldata = totalData.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          vendor:
            item?.vendorname == undefined ? item?.vendor : item?.vendorname,
          currdate:
            item?.date == undefined
              ? moment(item?.billdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
          vendorfrequency:
            item?.vendorfrequency == undefined
              ? item?.frequency
              : item?.vendorfrequency,
          amount:
            item?.billstatus == undefined
              ? item?.dueamount
              : item?.billstatus == "Partially Paid"
              ? item.balanceamount
              : item?.totalbillamount,
          source: item?.source,
          billno: item?.billno == undefined ? item?.referenceno : item?.billno,
          vendorid: item?.vendorid,
          filteredfrom: "Daily",
          filterdates: filterdates,
        };
      });

      return res.status(200).json({
        expensereminder: finaldata,
      });
    } else if (vendorfrequency === "Weekly") {
      if (filterdates === "") {
        const currentWeekStartDate = moment(currentDate, "YYYY-MM-DD")
          .startOf("week")
          .format("YYYY-MM-DD");
        const currentWeekEndDate = moment(currentDate, "YYYY-MM-DD")
          .endOf("week")
          .format("YYYY-MM-DD");

        const dateAndBillStatusFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { date: { $exists: true, $ne: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpense = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilter],
        };

        const shcedulePaymentDailyFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { billdate: { $exists: true, $ne: "" } },
            { paidstatus: "Not Paid" },
          ],
        };

        const filterQuerySchedulePayment = {
          $and: [
            { $or: branchFilterSchedulePayment },
            shcedulePaymentDailyFilter,
          ],
        };

        const expense = await Expense.find(filterQueryExpense);

        const updatedDataOne = expense.filter((tp) => {
          return moment(tp.date, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const schedulePaymentData = await SchedulePayment.find(
          filterQuerySchedulePayment
        );

        const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
          return moment(tp.billdate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const totalData = [...updatedDataOne, ...updatedDataScheduleOne];

        const finaldata = totalData.map((item, index) => {
          return {
            _id: item._id,
            serialNumber: index + 1,
            vendor:
              item?.vendorname == undefined ? item?.vendor : item?.vendorname,
            currdate:
              item?.date == undefined
                ? moment(item?.billdate, "YYYY-MM-DD").format("DD-MM-YYYY")
                : moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
            vendorfrequency:
              item?.vendorfrequency == undefined
                ? item?.frequency
                : item?.vendorfrequency,
            amount:
              item?.billstatus == undefined
                ? item?.dueamount
                : item?.billstatus == "Partially Paid"
                ? item.balanceamount
                : item?.totalbillamount,
            source: item?.source,
            billno:
              item?.billno == undefined ? item?.referenceno : item?.billno,
            vendorid: item?.vendorid,
            filteredfrom: "Weekly",
            filterdates: filterdates,
          };
        });

        return res.status(200).json({
          expensereminder: finaldata,
        });
      } else {
        const currentWeekStartDate = filterdates;
        const currentWeekEndDate = moment(filterdates, "YYYY-MM-DD")
          .add(6, "days")
          .format("YYYY-MM-DD");

        const dateAndBillStatusFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { date: { $exists: true, $ne: "" } },
            {
              $or: [
                { billstatus: "InComplete" },
                { billstatus: "Partially Paid" },
              ],
            },
          ],
        };

        const filterQueryExpense = {
          $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilter],
        };

        const shcedulePaymentDailyFilter = {
          $and: [
            // { vendorfrequency: vendorfrequency },
            { billdate: { $exists: true, $ne: "" } },
            { paidstatus: "Not Paid" },
          ],
        };

        const filterQuerySchedulePayment = {
          $and: [
            { $or: branchFilterSchedulePayment },
            shcedulePaymentDailyFilter,
          ],
        };

        const expense = await Expense.find(filterQueryExpense);

        const updatedDataOne = expense.filter((tp) => {
          return moment(tp.date, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const schedulePaymentData = await SchedulePayment.find(
          filterQuerySchedulePayment
        );

        const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
          return moment(tp.billdate, "YYYY-MM-DD").isBetween(
            currentWeekStartDate,
            currentWeekEndDate,
            undefined,
            "[]"
          );
        });

        const totalData = [...updatedDataOne, ...updatedDataScheduleOne];

        const finaldata = totalData.map((item, index) => {
          return {
            _id: item._id,
            serialNumber: index + 1,
            vendor:
              item?.vendorname == undefined ? item?.vendor : item?.vendorname,
            currdate:
              item?.date == undefined
                ? moment(item?.billdate, "YYYY-MM-DD").format("DD-MM-YYYY")
                : moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
            vendorfrequency:
              item?.vendorfrequency == undefined
                ? item?.frequency
                : item?.vendorfrequency,
            amount:
              item?.billstatus == undefined
                ? item?.dueamount
                : item?.billstatus == "Partially Paid"
                ? item.balanceamount
                : item?.totalbillamount,
            source: item?.source,
            billno:
              item?.billno == undefined ? item?.referenceno : item?.billno,
            vendorid: item?.vendorid,
            filteredfrom: "Weekly",
            filterdates: filterdates,
          };
        });

        return res.status(200).json({
          expensereminder: finaldata,
        });
      }
    } else if (vendorfrequency === "Monthly") {
      const dateAndBillStatusFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { date: { $exists: true, $ne: "" } },
          // { duedate: { $lte: moment(currentDate).format("YYYY-MM-DD") } },
          {
            $or: [
              { billstatus: "InComplete" },
              { billstatus: "Partially Paid" },
            ],
          },
        ],
      };

      const filterQueryExpense = {
        $and: [{ $or: branchFilterExpense }, dateAndBillStatusFilter],
      };

      const shcedulePaymentDailyFilter = {
        $and: [
          // { vendorfrequency: vendorfrequency },
          { billdate: { $exists: true, $ne: "" } },
          // { receiptdate: { $eq: moment(currentDate).format("YYYY-MM-DD") } },
          { paidstatus: "Not Paid" },
        ],
      };

      const filterQuerySchedulePayment = {
        $and: [
          { $or: branchFilterSchedulePayment },
          shcedulePaymentDailyFilter,
        ],
      };

      const expense = await Expense.find(filterQueryExpense);

      const updatedDataOne = expense.filter((tp) => {
        const expenseMonth = moment(tp.date, "YYYY-MM-DD").format("MM");
        const expenseYear = moment(tp.date, "YYYY-MM-DD").format("YYYY");
        return expenseMonth === filterdates && expenseYear === filteryear;
      });

      // const updatedDataTwo = expensetwo
      //   .map((tp) => {
      //     tp.date = moment(tp.date, "YYYY-MM-DD")
      //       .add(1, "months")
      //       .format("YYYY-MM-DD");
      //     return tp;
      //   })
      //   .filter((tp) => {
      //     return moment(currentDate, "YYYY-MM-DD").isSameOrBefore(
      //       tp.date,
      //       "day"
      //     );
      //   });

      const schedulePaymentData = await SchedulePayment.find(
        filterQuerySchedulePayment
      );

      const updatedDataScheduleOne = schedulePaymentData.filter((tp) => {
        const expenseMonth = moment(tp.billdate, "YYYY-MM-DD").format("MM");
        const expenseYear = moment(tp.billdate, "YYYY-MM-DD").format("YYYY");
        return expenseMonth === filterdates && expenseYear === filteryear;
      });

      const totalData = [...updatedDataOne, ...updatedDataScheduleOne];

      const finaldata = totalData.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          vendor:
            item?.vendorname == undefined ? item?.vendor : item?.vendorname,
          currdate:
            item?.date == undefined
              ? moment(item?.billdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : moment(item?.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
          vendorfrequency:
            item?.vendorfrequency == undefined
              ? item?.frequency
              : item?.vendorfrequency,
          amount:
            item?.billstatus == undefined
              ? item?.dueamount
              : item?.billstatus == "Partially Paid"
              ? item.balanceamount
              : item?.totalbillamount,
          source: item?.source,
          billno: item?.billno == undefined ? item?.referenceno : item?.billno,
          vendorid: item?.vendorid,
          filteredfrom: "Monthly",
          filterdates: filterdates,
          filteryear: filteryear,
        };
      });

      return res.status(200).json({
        expensereminder: finaldata,
      });
    }
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});