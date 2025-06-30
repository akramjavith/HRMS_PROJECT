const Nonproduction = require("../../../../model/modules/production/nonproduction/nonproduction");
const Hirerarchi = require("../../../../model/modules/setup/hierarchy");
const Users = require("../../../../model/login/auth")
const ClientUserid = require("../../../../model/modules/production/ClientUserIDModel")
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");
const moment = require("moment");
const User = require("../../../../model/login/auth");

// get All Nonproduction => /api/Nonproduction
exports.getAllNonproduction = catchAsyncErrors(async (req, res, next) => {
  let nonproduction;
  try {
    nonproduction = await Nonproduction.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!nonproduction) {
    return next(new ErrorHandler("Nonproduction not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    nonproduction,
  });
});

// Create new Nonproduction => /api/Nonproduction/new
exports.addNonproduction = catchAsyncErrors(async (req, res, next) => {
  let anonproduction= await Nonproduction.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Nonproduction => /api/Nonproduction/:id
exports.getSingleNonproduction = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let snonproduction = await Nonproduction.findById(id);

  if (!snonproduction) {
    return next(new ErrorHandler("Nonproduction not found!", 404));
  }
  return res.status(200).json({
    snonproduction,
  });
});

// update Nonproduction by id => /api/Nonproduction/:id
exports.updateNonproduction = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let unonproduction = await Nonproduction.findByIdAndUpdate(id, req.body);
  if (!unonproduction) {
    return next(new ErrorHandler("Nonproduction not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Nonproduction by id => /api/Nonproduction/:id
exports.deleteNonproduction = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dnonproduction = await Nonproduction.findByIdAndRemove(id);

  if (!dnonproduction) {
    return next(new ErrorHandler("Nonproduction not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


//Filter COntroller
exports.getAllNonProductionFilter = catchAsyncErrors(async (req, res) => {
  try {
    // Destructure with proper defaults
    const {
      page,
      pageSize,
      allFilters,
      logicOperator,  // Added default value
      searchQuery,
      fromdate,
      todate,
      company,
      branch,
      unit,
      team,
      employee
    } = req.body;


    // Build the base query
    const query = {};
    const conditions = [];

    // Date range filter with validation
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Array filters with improved validation
    const arrayFilters = [
      { field: 'company', value: company },
      { field: 'branch', value: branch },
      { field: 'unit', value: unit },
      { field: 'team', value: team },
      { field: 'name', value: employee }
    ];

    arrayFilters.forEach(({ field, value }) => {
      if (Array.isArray(value) && value.length > 0) {
        query[field] = { $in: value.filter(Boolean) }; // Remove empty values
      }
    });

    // Process advanced filters with better validation
    if (Array.isArray(allFilters)) {
      allFilters.forEach(filter => {
        if (filter?.column && filter?.condition) {
          if (filter.value || ["Blank", "Not Blank"].includes(filter.condition)) {
            const condition = createFilterCondition(filter.column, filter.condition, filter.value);
            if (Object.keys(condition).length > 0) {
              conditions.push(condition);
            }
          }
        }
      });
    }

    // Search query handling with optimization
    if (typeof searchQuery === 'string' && searchQuery.trim()) {
      const searchTerms = searchQuery.trim().split(/\s+/); // Split on any whitespace
      const searchConditions = searchTerms.map(term => {
        const orConditions = [
          { name: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") },
          { date: new RegExp(term, "i") },
          { empcode: new RegExp(term, "i") }
        ];

        // Only add numeric condition if term is a valid number
        if (!isNaN(term) && term.trim() !== '') {
          orConditions.push({ count: Number(term) });
        }

        return { $or: orConditions };
      });

      if (searchConditions.length > 0) {
        query.$and = (query.$and || []).concat(searchConditions);
      }
    }

    // Combine conditions with logic operator
    if (conditions.length > 0) {
      const operator = ['and', 'or'].includes(logicOperator?.toLowerCase())
        ? logicOperator.toLowerCase()
        : 'and';
      query[`$${operator}`] = conditions;
    }

    // Execute queries in parallel with error handling
    const [totalProjects, result] = await Promise.all([
      Nonproduction.countDocuments(query).exec(),
      Nonproduction.find(query)
        .lean()
        .skip((Math.max(1, page) - 1) * pageSize)
        .limit(pageSize)
        .exec()
    ]);

    // Format response data
    const formattedResults = result.map((item, index) => ({
      id: item._id,
      serialNumber: index + 1 + ((page - 1) * pageSize), // Continuous numbering across pages
      name: item.name || '',
      empcode: item.empcode || '',
      fromdate: item.date ? moment(item.date).format("DD-MM-YYYY") : '',
      mode: item.mode || '',
      count: item.count || 0
    }));

    return res.status(200).json({
      success: true,
      totalProjects,
      filterdatanonproduction: formattedResults,
      currentPage: Math.max(1, page),
      totalPages: Math.ceil(totalProjects / pageSize)
    });

  } catch (err) {
    console.error('Error in getAllNonProductionFilter:', err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getAllNonproductionForPagination = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, allFilters, logicOperator, searchQuery } = req.body;

    console.log(page, "page");
    console.log(pageSize, "pageSize");
    console.log(allFilters, "allFilters");
    console.log(logicOperator, "logicOperator");
    console.log(searchQuery, "searchQuery");
    let query = {};
    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
            }
        });
    }

    if (searchQuery) {
        const searchTermsArray = searchQuery.split(" ");

        const orConditions = searchTermsArray.map((term) => {
            const conditions = [
                { name: new RegExp(term, "i") },
                { category: new RegExp(term, "i") },
                { subcategory: new RegExp(term, "i") },
                { mode: new RegExp(term, "i") },
                { count: new RegExp(term, "i") },
                { date: new RegExp(term, "i") },
                { fromtime: new RegExp(term, "i") },
                { totime: new RegExp(term, "i") },
                { totalhours: new RegExp(term, "i") },
                { alloteddays: new RegExp(term, "i") },
                { allotedhours: new RegExp(term, "i") },
                { allotedminutes: new RegExp(term, "i") },
                { days: new RegExp(term, "i") },
                { hours: new RegExp(term, "i") },
                { minutes: new RegExp(term, "i") },
                { company: new RegExp(term, "i") },
                { branch: new RegExp(term, "i") },
                { unit: new RegExp(term, "i") },
                { team: new RegExp(term, "i") },
                { empcode: new RegExp(term, "i") },
            ];

            // Only add numeric conditions if term is a number
            // if (!isNaN(term)) {
            //     const numTerm = parseFloat(term);
            //     conditions.push(
            //         { mindays: numTerm },
            //         { minhours: numTerm },
            //         { minminutes: numTerm },
            //         { maxdays: numTerm },
            //         { maxhours: numTerm },
            //         { maxminutes: numTerm },
            //         { rate: numTerm }
            //     );
            // }

            return { $or: conditions };
        });

        query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
        if (logicOperator === "AND") {
            query.$and = [...(query.$and || []), ...conditions];
        } else if (logicOperator === "OR") {
            query.$or = [...(query.$or || []), ...conditions];
        }
    }

    try {
        const totalProjects = await Nonproduction.countDocuments(query);
        const result = await Nonproduction.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();

        res.status(200).json({
            totalProjects,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize)
        });
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getAllNonproductionListFilter = catchAsyncErrors(async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    pageApproved = 1,
    pageReject = 1,
    pageSizeApprove = 10,
    pagesizeReject = 10,
    allFilters,
    logicOperator,
    searchQuery,
    base,
    category,
    subcategory,
    fromdate,
    todate
  } = req.body;
  console.log("forALL")

  try {
    // Build the base query
    const query = {};
    let conditions = [];

    // Base filtering
    if (base && base !== "All") {
      query.mode = { $regex: new RegExp(base, "i") };
    }

    // Category and subcategory filtering
    if (category?.length) query.category = { $in: category };
    if (subcategory?.length) query.subcategory = { $in: subcategory };

    // Date filtering
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      });
    }

    // Search query handling
    if (searchQuery) {
      const searchTermsArray = searchQuery.split(" ");
      const orConditions = searchTermsArray.map((term) => {
        const conditions = [
          { name: new RegExp(term, "i") },
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") },
          { date: new RegExp(term, "i") }
        ];

        // Add numeric field searches if term is a number
        if (!isNaN(term)) {
          const numTerm = parseFloat(term);
          conditions.push(
            { count: numTerm },
            { totalhours: numTerm },
            { alloteddays: numTerm },
            { allotedhours: numTerm },
            { allotedminutes: numTerm },
            { days: numTerm },
            { hours: numTerm },
            { minutes: numTerm }
          );
        }
        return { $or: conditions };
      });
      query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = [...(query.$and || []), ...conditions];
      } else if (logicOperator === "OR") {
        query.$or = [...(query.$or || []), ...conditions];
      }
    }

    // Common transformation function
    const transformItem = (item, index) => ({
      ...item,
      serialNumber: index + 1,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: moment(item.date).format("DD-MM-YYYY"),
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count
    });

    // Get counts for all statuses
    const totalCount = await Nonproduction.countDocuments(query);
    const assignedCount = await Nonproduction.countDocuments({ ...query, approvestatus: undefined });
    const approvedCount = await Nonproduction.countDocuments({ ...query, approvestatus: true });
    const rejectedCount = await Nonproduction.countDocuments({ ...query, approvestatus: false });

    // Fetch paginated data for each list
    const assignQuery = { ...query, approvestatus: undefined };
    const approvedQuery = { ...query, approvestatus: true };
    const rejectedQuery = { ...query, approvestatus: false };

    const [assignlist, approvedlist, rejectlist] = await Promise.all([
      Nonproduction.find(assignQuery)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize))
        .lean()
        .then(items => items.map(transformItem)),

      Nonproduction.find(approvedQuery)
        .skip((pageApproved - 1) * pageSizeApprove)
        .limit(parseInt(pageSizeApprove))
        .lean()
        .then(items => items.map(transformItem)),

      Nonproduction.find(rejectedQuery)
        .skip((pageReject - 1) * pagesizeReject)
        .limit(parseInt(pagesizeReject))
        .lean()
        .then(items => items.map((item, index) => ({
          ...transformItem(item, index),
          rejectionReason: item.rejectionReason // Include rejection reason if available
        })))
    ]);

    return res.status(200).json({
      counts: {
        total: totalCount,
        assigned: assignedCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      pagination: {
        assigned: {
          currentPage: page,
          totalPages: Math.ceil(assignedCount / pageSize),
          pageSize: pageSize
        },
        approved: {
          currentPage: pageApproved,
          totalPages: Math.ceil(approvedCount / pageSizeApprove),
          pageSize: pageSizeApprove
        },
        rejected: {
          currentPage: pageReject,
          totalPages: Math.ceil(rejectedCount / pagesizeReject),
          pageSize: pagesizeReject
        }
      },
      lists: {
        assignlist,
        approvedlist,
        rejectlist
      }
    });

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Error fetching records!", 500));
  }
});

exports.getAllNonproductionListFilterExports = catchAsyncErrors(async (req, res, next) => {
  const {
    allFilters,
    logicOperator,
    searchQuery,
    base,
    category,
    subcategory,
    fromdate,
    todate
  } = req.body;
  console.log("forALL")

  try {
    // Build the base query
    const query = {};
    let conditions = [];

    // Base filtering
    if (base && base !== "All") {
      query.mode = { $regex: new RegExp(base, "i") };
    }

    // Category and subcategory filtering
    if (category?.length) query.category = { $in: category };
    if (subcategory?.length) query.subcategory = { $in: subcategory };

    // Date filtering
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      });
    }

    // Search query handling
    if (searchQuery) {
      const searchTermsArray = searchQuery.split(" ");
      const orConditions = searchTermsArray.map((term) => {
        const conditions = [
          { name: new RegExp(term, "i") },
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") },
          { date: new RegExp(term, "i") }
        ];

        // Add numeric field searches if term is a number
        if (!isNaN(term)) {
          const numTerm = parseFloat(term);
          conditions.push(
            { count: numTerm },
            { totalhours: numTerm },
            { alloteddays: numTerm },
            { allotedhours: numTerm },
            { allotedminutes: numTerm },
            { days: numTerm },
            { hours: numTerm },
            { minutes: numTerm }
          );
        }
        return { $or: conditions };
      });
      query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = [...(query.$and || []), ...conditions];
      } else if (logicOperator === "OR") {
        query.$or = [...(query.$or || []), ...conditions];
      }
    }

    // Common transformation function
    const transformItem = (item, index) => ({
      ...item,
      serialNumber: index + 1,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: moment(item.date).format("DD-MM-YYYY"),
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count
    });

    // Fetch paginated data for each list
    const assignQuery = { ...query, approvestatus: undefined };
    const approvedQuery = { ...query, approvestatus: true };
    const rejectedQuery = { ...query, approvestatus: false };

    const [assignlist, approvedlist, rejectlist] = await Promise.all([
      Nonproduction.find(assignQuery)
        .lean()
        .then(items => items.map(transformItem)),

      Nonproduction.find(approvedQuery)
        .lean()
        .then(items => items.map(transformItem)),

      Nonproduction.find(rejectedQuery)
        .lean()
        .then(items => items.map((item, index) => ({
          ...transformItem(item, index),
          rejectionReason: item.rejectionReason // Include rejection reason if available
        })))
    ]);

    return res.status(200).json({
      lists: {
        assignlist,
        approvedlist,
        rejectlist
      }
    });

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Error fetching records!", 500));
  }
});

exports.getAllNonproductionListFilterForAssign = catchAsyncErrors(async (req, res, next) => {
  const {
    page,
    pageSize,
    allFilters,
    logicOperator,
    searchQuery,
    base,
    category,
    subcategory,
    fromdate,
    todate
  } = req.body;

  console.log(page, "page")
  console.log(pageSize, "pageSize")
  console.log(searchQuery, "searchQuery")

  try {
    // Build the base query
    const query = {};
    let conditions = [];

    // Base filtering
    if (base && base !== "All") {
      query.mode = { $regex: new RegExp(base, "i") };
    }

    // Category and subcategory filtering
    if (category?.length) query.category = { $in: category };
    if (subcategory?.length) query.subcategory = { $in: subcategory };

    // Date filtering
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterConditionDate(filter.column, filter.condition, filter.value));
        }
      });
    }

    // Search query handling
    if (searchQuery) {
      const searchTermsArray = searchQuery.split(" ");
      const orConditions = searchTermsArray.map((term) => {
        const conditions = [
          { name: new RegExp(term, "i") },
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") }
        ];

        // Check if the term matches a date format (DD-MM-YYYY)
        const dateMatch = term.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dateMatch) {
          // Convert to database format (YYYY-MM-DD)
          const dbDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
          conditions.push({ date: dbDate });
        } else {
          // For non-date terms, keep the regex search on date as string
          conditions.push({ date: new RegExp(term, "i") });
        }

        // Add numeric field searches if term is a number
        if (!isNaN(term)) {
          const numTerm = parseFloat(term);
          conditions.push(
            { count: numTerm },
            { totalhours: numTerm },
            { alloteddays: numTerm },
            { allotedhours: numTerm },
            { allotedminutes: numTerm },
            { days: numTerm },
            { hours: numTerm },
            { minutes: numTerm }
          );
        }
        return { $or: conditions };
      });
      query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = [...(query.$and || []), ...conditions];
      } else if (logicOperator === "OR") {
        query.$or = [...(query.$or || []), ...conditions];
      }
    }

    // Common transformation function
    const transformItem = (item, index) => ({
      ...item,
      serialNumber: index + 1,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: moment(item.date).format("DD-MM-YYYY"),
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count
    });

    // Get counts for all statuses
    const assignedCount = await Nonproduction.countDocuments({ ...query, approvestatus: undefined });


    // Fetch paginated data for each list
    const assignQuery = { ...query, approvestatus: undefined };

    const [assignlist] = await Promise.all([
      Nonproduction.find(assignQuery)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize))
        .lean()
        .then(items => items.map(transformItem)),
    ]);

    return res.status(200).json({
      counts: {
        assigned: assignedCount,
      },
      pagination: {
        assigned: {
          currentPage: page,
          totalPages: Math.ceil(assignedCount / pageSize),
          pageSize: pageSize
        },
      },
      lists: {
        assignlist,
      }
    });

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Error fetching records!", 500));
  }
});

exports.getAllNonproductionListFilterApproved = catchAsyncErrors(async (req, res, next) => {
  const {
    pageApproved,
    pageSizeApprove,
    allFilters,
    logicOperator,
    searchQueryAssign,
    base,
    category,
    subcategory,
    fromdate,
    todate
  } = req.body;
  console.log("forALL")
  console.log(searchQueryAssign, "forALL")

  try {
    // Build the base query
    const query = {};
    let conditions = [];

    // Base filtering
    if (base && base !== "All") {
      query.mode = { $regex: new RegExp(base, "i") };
    }

    // Category and subcategory filtering
    if (category?.length) query.category = { $in: category };
    if (subcategory?.length) query.subcategory = { $in: subcategory };

    // Date filtering
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterConditionDate(filter.column, filter.condition, filter.value));
        }
      });
    }

    // Search query handling
    if (searchQueryAssign) {
      const searchTermsArray = searchQueryAssign.split(" ");
      const orConditions = searchTermsArray.map((term) => {
        const conditions = [
          { name: new RegExp(term, "i") },
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") }
        ];

        // Check if the term matches a date format (DD-MM-YYYY)
        const dateMatch = term.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dateMatch) {
          // Convert to database format (YYYY-MM-DD)
          const dbDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
          conditions.push({ date: dbDate });
        } else {
          // For non-date terms, keep the regex search on date as string
          conditions.push({ date: new RegExp(term, "i") });
        }

        // Add numeric field searches if term is a number
        if (!isNaN(term)) {
          const numTerm = parseFloat(term);
          conditions.push(
            { count: numTerm },
            { totalhours: numTerm },
            { alloteddays: numTerm },
            { allotedhours: numTerm },
            { allotedminutes: numTerm },
            { days: numTerm },
            { hours: numTerm },
            { minutes: numTerm }
          );
        }
        return { $or: conditions };
      });
      query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = [...(query.$and || []), ...conditions];
      } else if (logicOperator === "OR") {
        query.$or = [...(query.$or || []), ...conditions];
      }
    }

    // Common transformation function
    const transformItem = (item, index) => ({
      ...item,
      serialNumber: index + 1,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: moment(item.date).format("DD-MM-YYYY"),
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count
    });

    // Get counts for all statuses
    const totalCount = await Nonproduction.countDocuments(query);
    const approvedCount = await Nonproduction.countDocuments({ ...query, approvestatus: true });

    // Fetch paginated data for each list
    const approvedQuery = { ...query, approvestatus: true };

    const [approvedlist] = await Promise.all([

      Nonproduction.find(approvedQuery)
        .skip((pageApproved - 1) * pageSizeApprove)
        .limit(parseInt(pageSizeApprove))
        .lean()
        .then(items => items.map(transformItem)),


    ]);

    return res.status(200).json({
      counts: {
        total: totalCount,
        approved: approvedCount,
      },
      pagination: {
        approved: {
          currentPage: pageApproved,
          totalPages: Math.ceil(approvedCount / pageSizeApprove),
          pageSize: pageSizeApprove
        },
      },
      lists: {
        approvedlist,
      }
    });

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Error fetching records!", 500));
  }
});

exports.getAllNonproductionListFilterRejected = catchAsyncErrors(async (req, res, next) => {
  const {
    pageReject = 1,
    pagesizeReject = 10,
    allFilters,
    logicOperator,
    searchQueryall,
    base,
    category,
    subcategory,
    fromdate,
    todate
  } = req.body;
  console.log("forALL")

  try {
    // Build the base query
    const query = {};
    let conditions = [];

    // Base filtering
    if (base && base !== "All") {
      query.mode = { $regex: new RegExp(base, "i") };
    }

    // Category and subcategory filtering
    if (category?.length) query.category = { $in: category };
    if (subcategory?.length) query.subcategory = { $in: subcategory };

    // Date filtering
    if (fromdate || todate) {
      query.date = {};
      if (fromdate) query.date.$gte = fromdate;
      if (todate) query.date.$lte = todate;
    }

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterConditionDate(filter.column, filter.condition, filter.value));
        }
      });
    }

    // Search query handling
    if (searchQueryall) {
      const searchTermsArray = searchQueryall.split(" ");
      const orConditions = searchTermsArray.map((term) => {
        const conditions = [
          { name: new RegExp(term, "i") },
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { mode: new RegExp(term, "i") }
        ];

        // Check if the term matches a date format (DD-MM-YYYY)
        const dateMatch = term.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dateMatch) {
          // Convert to database format (YYYY-MM-DD)
          const dbDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
          conditions.push({ date: dbDate });
        } else {
          // For non-date terms, keep the regex search on date as string
          conditions.push({ date: new RegExp(term, "i") });
        }

        // Add numeric field searches if term is a number
        if (!isNaN(term)) {
          const numTerm = parseFloat(term);
          conditions.push(
            { count: numTerm },
            { totalhours: numTerm },
            { alloteddays: numTerm },
            { allotedhours: numTerm },
            { allotedminutes: numTerm },
            { days: numTerm },
            { hours: numTerm },
            { minutes: numTerm }
          );
        }
        return { $or: conditions };
      });
      query.$and = orConditions;
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = [...(query.$and || []), ...conditions];
      } else if (logicOperator === "OR") {
        query.$or = [...(query.$or || []), ...conditions];
      }
    }

    // Common transformation function
    const transformItem = (item, index) => ({
      ...item,
      serialNumber: index + 1,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: moment(item.date).format("DD-MM-YYYY"),
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count
    });

    // Get counts for all statuses
    const totalCount = await Nonproduction.countDocuments(query);
    const rejectedCount = await Nonproduction.countDocuments({ ...query, approvestatus: false });

    // Fetch paginated data for each list
    const rejectedQuery = { ...query, approvestatus: false };

    const [rejectlist] = await Promise.all([
      Nonproduction.find(rejectedQuery)
        .skip((pageReject - 1) * pagesizeReject)
        .limit(parseInt(pagesizeReject))
        .lean()
        .then(items => items.map((item, index) => ({
          ...transformItem(item, index),
          rejectionReason: item.rejectionReason // Include rejection reason if available
        })))
    ]);

    return res.status(200).json({
      counts: {
        total: totalCount,
        rejected: rejectedCount
      },
      pagination: {
        rejected: {
          currentPage: pageReject,
          totalPages: Math.ceil(rejectedCount / pagesizeReject),
          pageSize: pagesizeReject
        }
      },
      lists: {
        rejectlist
      }
    });

  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Error fetching records!", 500));
  }
});

function createFilterCondition(column, condition, value) {
  console.log(column, condition, value)
  switch (condition) {
    case "Contains":
      return { [column]: new RegExp(value, 'i') };
    case "Does Not Contain":
      return { [column]: { $not: new RegExp(value, 'i') } };
    case "Equals":
      return { [column]: value };
    case "Does Not Equal":
      return { [column]: { $ne: value } };
    case "Begins With":
      return { [column]: new RegExp(`^${value}`, 'i') };
    case "Ends With":
      return { [column]: new RegExp(`${value}$`, 'i') };
    case "Blank":
      return { [column]: { $exists: false } };
    case "Not Blank":
      return { [column]: { $exists: true } };
    default:
      return {};
  }
}

exports.getAllUsersNonProductionForExports = catchAsyncErrors(async (req, res, next) => {
  const {
    company,
    branch,
  } = req.body;

  try {
    // Build the base query
    const baseQuery = {
      enquirystatus: { $nin: ["Enquiry Purpose"] },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee",
          "Absconded", "Hold", "Terminate"]
      }
    };

    // Handle company filter
    if (company) {
      if (Array.isArray(company) && company.length) {
        baseQuery.company = { $in: company };
      } else if (typeof company === 'string' && company.trim()) {
        baseQuery.company = company.trim();
      }
    }

    // Handle branch filter
    if (branch) {
      if (Array.isArray(branch) && branch.length) {
        baseQuery.branch = { $in: branch };
      } else if (typeof branch === 'string' && branch.trim()) {
        baseQuery.branch = branch.trim();
      }
    }

    // Projection for lean query
    const projection = {
      _id: 1,
      company: 1,
      unit: 1,
      branch: 1,
      team: 1,
      companyname: 1 // Make sure this matches your DB field
    };

    const [totalCount, results] = await Promise.all([
      User.countDocuments(baseQuery).lean().exec(),
      User.find(baseQuery, projection)
        .lean()

    ]);

    return res.status(200).json({
      success: true,
      totalProjects: totalCount,
      result: results,
    });

  } catch (err) {
    console.error('Error fetching users:', err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllUsersNonProduction = catchAsyncErrors(async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    allFilters = [],
    logicOperator = 'and',
    searchQuery,
    company,
    branch,
  } = req.body;

  try {
    // Build the base query
    const baseQuery = {
      enquirystatus: { $nin: ["Enquiry Purpose"] },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee",
          "Absconded", "Hold", "Terminate"]
      }
    };

    // Handle company filter
    if (company) {
      if (Array.isArray(company) && company.length) {
        baseQuery.company = { $in: company };
      } else if (typeof company === 'string' && company.trim()) {
        baseQuery.company = company.trim();
      }
    }

    // Handle branch filter
    if (branch) {
      if (Array.isArray(branch) && branch.length) {
        baseQuery.branch = { $in: branch };
      } else if (typeof branch === 'string' && branch.trim()) {
        baseQuery.branch = branch.trim();
      }
    }

    // Process advanced filters
    const conditions = [];
    for (const filter of allFilters) {
      if (filter?.column && filter?.condition &&
        (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        const condition = createFilterConditionForAllot(
          filter.column,
          filter.condition,
          filter.value,
          company // Pass company filter if needed
        );
        if (condition && Object.keys(condition).length) {
          conditions.push(condition);
        }
      }
    }

    // Add conditions to query
    if (conditions.length) {
      const operator = ['and', 'or'].includes(logicOperator.toLowerCase())
        ? logicOperator.toLowerCase()
        : 'and';
      baseQuery[`$${operator}`] = conditions;
    }

    // Search query handling
    if (typeof searchQuery === 'string' && searchQuery.trim()) {
      const searchTerms = searchQuery.trim().split(/\s+/);
      const searchConditions = [];

      for (const term of searchTerms) {
        const termConditions = [
          { company: new RegExp(term, "i") },
          { unit: new RegExp(term, "i") },
          { branch: new RegExp(term, "i") },
          { team: new RegExp(term, "i") },
          { companyname: new RegExp(term, "i") } // Search in companyname field
        ];

        if (!isNaN(term) && term.trim() !== '') {
          termConditions.push({ count: Number(term) });
        }

        searchConditions.push({ $or: termConditions });
      }

      if (searchConditions.length) {
        baseQuery.$and = (baseQuery.$and || []).concat(searchConditions);
      }
    }

    // Projection for lean query
    const projection = {
      _id: 1,
      company: 1,
      unit: 1,
      branch: 1,
      team: 1,
      companyname: 1 // Make sure this matches your DB field
    };

    const [totalCount, results] = await Promise.all([
      User.countDocuments(baseQuery).lean().exec(),
      User.find(baseQuery, projection)
        .lean()
        .skip((Math.max(1, page) - 1) * pageSize)
        .limit(pageSize)
        .read('secondary')
        .exec()
    ]);

    return res.status(200).json({
      success: true,
      totalProjects: totalCount,
      result: results,
      currentPage: Math.max(1, page),
      totalPages: Math.ceil(totalCount / pageSize)
    });

  } catch (err) {
    console.error('Error fetching users:', err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});

function createFilterConditionForAllot(column, condition, value, companyFilter) {
  // Map frontend's 'employeename' to database's 'companyname'
  if (column === 'employeename') {
    const dbFieldCondition = getBaseCondition('companyname', condition, value);

    if (companyFilter) {
      const companyCondition = typeof companyFilter === 'string'
        ? { company: companyFilter }
        : { company: { $in: companyFilter } };

      return {
        $and: [dbFieldCondition, companyCondition]
      };
    }

    return dbFieldCondition;
  }

  // Normal cases for other fields
  return getBaseCondition(column, condition, value);
  }


function createFilterConditionDate(column, condition, value) {
  console.log(column, condition, value);

  // Check if the column is a date field
  const isDateField = column.toLowerCase() === 'date';

  // For date fields
  if (isDateField && !["Blank", "Not Blank"].includes(condition)) {
    // Handle Blank/Not Blank conditions first
    if (condition === "Blank") return { [column]: { $exists: false } };
    if (condition === "Not Blank") return { [column]: { $exists: true } };

    // Convert input date (DD-MM-YYYY) to database format (YYYY-MM-DD)
    let dbFormattedDate;
    try {
      if (value.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = value.split('-');
        dbFormattedDate = `${year}-${month}-${day}`;
      } else {
        // If it's already in YYYY-MM-DD format, use as-is
        dbFormattedDate = value;
      }
    } catch (e) {
      console.error('Date format conversion error:', e);
      return {};
    }

    switch (condition) {
      case "Contains":
        // For string dates, Contains would match partial strings
        return { [column]: new RegExp(dbFormattedDate, 'i') };
      case "Does Not Contain":
        return { [column]: { $not: new RegExp(dbFormattedDate, 'i') } };
      case "Equals":
        return { [column]: dbFormattedDate };
      case "Does Not Equal":
        return { [column]: { $ne: dbFormattedDate } };
      case "Begins With":
        return { [column]: new RegExp(`^${dbFormattedDate}`, 'i') };
      case "Ends With":
        return { [column]: new RegExp(`${dbFormattedDate}$`, 'i') };
      case "Greater Than":
        return { [column]: { $gt: dbFormattedDate } };
      case "Less Than":
        return { [column]: { $lt: dbFormattedDate } };
      case "Greater Than Or Equal":
        return { [column]: { $gte: dbFormattedDate } };
      case "Less Than Or Equal":
        return { [column]: { $lte: dbFormattedDate } };
      default:
        return {};
    }
  }

  // For non-date fields
  switch (condition) {
    case "Contains":
      return { [column]: new RegExp(value, 'i') };
    case "Does Not Contain":
      return { [column]: { $not: new RegExp(value, 'i') } };
    case "Equals":
      return { [column]: value };
    case "Does Not Equal":
      return { [column]: { $ne: value } };
    case "Begins With":
      return { [column]: new RegExp(`^${value}`, 'i') };
    case "Ends With":
      return { [column]: new RegExp(`${value}$`, 'i') };
    case "Blank":
      return { [column]: { $exists: false } };
    case "Not Blank":
      return { [column]: { $exists: true } };
    default:
      return {};
  }
}




//overall nonchecklist

exports.getAllNonproductionOverallCheckList = catchAsyncErrors(async (req, res, next) => {
  let nonproduction;
  try {
    nonproduction = await Nonproduction.find({mode:req.body.base,approvestatus:{$exists:false}},{});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    nonproduction,
  });
});


exports.getAllNonproductionOverallCheckListReject = catchAsyncErrors(async (req, res, next) => {
  let nonproduction;
  try {
    console.log(req.body.base,"coutnreje")
    nonproduction = await Nonproduction.find({mode:req.body.base,approvestatus:false},{});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    nonproduction,
  });
});


//team nonproductionchecklist
exports.getAllTeamNonProductionChecklistApprove = catchAsyncErrors(
  async (req, res, next) => {
    let result,
      reportingtobaseduser,
      clientuserid,
      hierarchy,
      resultAccessFilter,
      secondaryhierarchyfinal,
      tertiaryhierarchyfinal,
      primaryhierarchyfinal,
      hierarchyfilter,
      filteredoverall,
      primaryhierarchy,
      hierarchyfilter1,
      secondaryhierarchy,
      hierarchyfilter2,
      tertiaryhierarchy,
      primaryhierarchyall,
      secondaryhierarchyall,
      tertiaryhierarchyall,
      branch,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      myallTotalNames,
      hierarchyFinal,
      hierarchyDefault,
      reportingusers, hierarchyfirstlevel;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []

    try {
      const { listpageaccessmode } = req.body;
      let clientidsmap;
      let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

      let finalDataRestrictList = []
      if (listpageaccessmode === "Reporting to Based") {
        let usersss = await User.find(
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
            reportingto: req.body.username,
          },
          {
            empcode: 1,
            companyname: 1,
          }
        ).lean();
        const companyNames = usersss.map((user) => user.companyname);
        let clientids = await ClientUserid.find(
          {
            empname: { $in: companyNames },
          },
          { userid: 1 }
        ).lean();
        clientidsmap = clientids.map((user) => user.userid);
      }

      let prodresult = await Nonproduction.find(
        {
       mode:req.body.base,
       approvestatus:{$exists:false},
          ...(listpageaccessmode === "Reporting to Based"
            ? { empname: { $in: req.body.username } }
            : {}),
        },
        {
          name: 1,
          category: 1,
          subcategory: 1,
          mode: 1,
          count: 1,
          date: 1,
          fromtime: 1,
          totime: 1,
          totalhours: 1,
          alloteddays: 1,
          allotedhours: 1,
          allotedminutes: 1,
          days: 1,
          hours: 1,
          minutes: 1,
          rejectreason:1,
          createdAt: 1,
          _id: 1,
        }
      );

      clientuserid = await ClientUserid.find(
        { loginallotlog: { $exists: true, $ne: [] } },
        { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
      ).lean();

      result = prodresult.map((item) => {
        return {
          category: item.category,
          subcategory: item.subcategory,
          mode: item.mode,
          count:item.count,
          date: item.date,
          fromtime: item.fromtime,
          totime:item.totime,
          totalhours:item.totalhours,
          alloteddays:item.alloteddays,
          allotedhours:item.allotedhours,
          allotedminutes:item.allotedminutes,
          days: item.days,
          hours: item.hours,
          minutes:item.minutes,
          rejectreason:item.rejectreason,
          createdAt: item.createdAt,
          _id: item._id,
          companyname: item.name,
        };
      });
      resultsectorother = result
      //myhierarchy dropdown
      if (
        req.body.hierachy === "myhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchy = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: req.body.sector,
        });
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        hierarchyFinal =
          req.body.sector === "all"
            ? answerDef.length > 0
              ? [].concat(...answerDef)
              : []
            : hierarchy.length > 0
              ? [].concat(...hierarchy.map((item) => item.employeename))
              : [];

        hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

        hierarchyfilter = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Primary",
        });
        primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
          ? hierarchyfilter.map((item) => item.employeename[0])
          : [];

        hierarchyfilter1 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Secondary",
        });
        secondaryhierarchy = hierarchyfilter1.map(
          (item) => item.employeename[0]
        )
          ? hierarchyfilter1.map((item) => item.employeename[0])
          : [];

        hierarchyfilter2 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Tertiary",
        });
        tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
          ? hierarchyfilter2.map((item) => item.employeename[0])
          : [];

        resulted = result
          .map((userObj) => {
            const matchingHierarchy = hierarchyDefault.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
            category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
          rejectreason:userObj.rejectreason,
              createdAt: userObj.createdAt,
              _id: userObj._id,
              level: matchingHierarchy ? matchingHierarchy.level : "",
              control: matchingHierarchy ? matchingHierarchy.control : "",
            };
          })
          .filter((data) => hierarchyMap.includes(data.companyname));
      }

      if (
        req.body.hierachy === "allhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );


        // let sectorFinal = req.body.sector == "all"
        //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        // hierarchyDefault = await Hirerarchi.find({
        //   supervisorchoose: req.body.username,
        //   level: { $in: sectorFinal },

        // });


        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault
          .map((data) => data.employeename)
          .flat();

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          answerDef,
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        resultedTeam = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
              _id: userObj._id,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));

        if (resultedTeam.length == 0) {

          let sectorFinal = req.body.sector == "all"
            ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

          let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
            supervisorchoose: req.body.username,
          }, { level: 1 });

          FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
          //  let hierarchySecond2 = await Hirerarchi.find({});
          hierarchySecond = await Hirerarchi.find(
            {},
            { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
          );

          hierarchyDefault = await Hirerarchi.find({
            supervisorchoose: req.body.username,
            //  level: { $nin: sectorFinal },

          });

          console.log(hierarchySecond.length, "hierarchyDefault")

          let answerDef = hierarchyDefault
            .map((data) => data.employeename)
            .flat();

          console.log(answerDef, "answerDef")

          function findEmployeesRecursive(
            currentSupervisors,
            processedSupervisorsallsector,
            resultsectorother
          ) {
            const filteredData = hierarchySecond.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            if (filteredData.length === 0) {
              return resultsectorother;
            }

            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
              return employees;
            }, []);

            const uniqueNewEmployees = [...new Set(newEmployees)];
            resultsectorother = [...resultsectorother, ...filteredData];
            // console.log(result, "result")
            return findEmployeesRecursive(
              uniqueNewEmployees,
              processedSupervisorsallsector,
              resultsectorother
            );
          }

          const processedSupervisorsallsector = new Set();
          const filteredOverallItem = findEmployeesRecursive(
            answerDef,
            processedSupervisorsallsector,
            []
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }



      }

      //my + all hierarchy list dropdown

      if (
        req.body.hierachy === "myallhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );

        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          [req.body.username],
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        filteredoverall = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
               category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
              _id: userObj._id,
              createdAt: userObj.createdAt,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));



        //alert there is no sector
        if (filteredoverall.length == 0) {

          let hierarchySecond2 = await Hirerarchi.find();
          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
          console.log(hierarchyfirstlevel, "hierarchyfirstlevel")

          function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
            const filteredData = hierarchySecond2.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            console.log(filteredData.length, "l;lp");
            if (filteredData.length === 0) {
              return resultsectorother; // No more employees to process
            }

            // Collect new employees
            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
              return employees;
            }, []);

            // Prevent duplicates
            const uniqueNewEmployees = [...new Set(newEmployees)];

            // **Modify `resultall` in place** instead of reassigning it
            resultsectorother.push(...filteredData);

            // console.log(result, "resultall1");

            // Recursive call with new employees
            return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
          }

          const processedSupervisorsallsector = new Set();
          // const resultall = []; // Define `resultall` outside to maintain reference

          const filteredOverallItem = findEmployeesRecursive(
            [req.body.username],
            processedSupervisorsallsector,
            resultsectorother // Pass the reference instead of a new array
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }

     
      }

      if (listpageaccessmode === "Reporting to Based") {
        reportingtobaseduser = result.map((userObj) => {
          return {
            companyname: userObj.companyname,
             category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
            _id: userObj._id,
            level: "",
            control: "",
          };
        });
      }

   

      let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)

      const restrictTeam = await Hirerarchi.aggregate([
        {
          $match: {
            $or: [
              {
                supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
              },
              {
                employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
              }
            ],
            level: { $in: levelFinal } // Matches if level field has a value in levelFinal
          },
        },
        {
          $lookup: {
            from: "reportingheaders",
            let: {
              teamControlsArray: {
                $ifNull: ["$pagecontrols", []]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$name",
                          "$$teamControlsArray"
                        ]
                      }, // Check if 'name' is in 'teamcontrols' array
                      {
                        $in: [
                          req?.body?.pagename,
                          "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                        ]
                      } // Additional condition for reportingnew array
                    ]
                  }
                }
              }
            ],
            as: "reportData" // The resulting matched documents will be in this field
          }
        },
        {
          $project: {
            supervisorchoose: 1,
            employeename: 1,
            reportData: 1
          }
        }
      ]);
      let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
      console.log(restrictListTeam, resultedTeam, "restrictListTeam")
      resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
      resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];

      console.log(resultAccessFilter, resultAccessFilterHierarchy.length, filteredoverallsectorall, "oooo")
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // result
      // resulted,
      // resultedTeam,
      // branch,
      // hierarchy,
      // overallMyallList,
      hierarchyfirstlevel,
      filteredoverallsectorall,
      resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
      resultAccessFilter,
      // primaryhierarchy,
      //  secondaryhierarchy,
      //  tertiaryhierarchy,
      //  primaryhierarchyall,
      //  secondaryhierarchyall,
      //  tertiaryhierarchyall,
      //  primaryhierarchyfinal,
      //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
  }
);


exports.getAllTeamNonProductionChecklistReject = catchAsyncErrors(
  async (req, res, next) => {
    let result,
      reportingtobaseduser,
      clientuserid,
      hierarchy,
      resultAccessFilter,
      secondaryhierarchyfinal,
      tertiaryhierarchyfinal,
      primaryhierarchyfinal,
      hierarchyfilter,
      filteredoverall,
      primaryhierarchy,
      hierarchyfilter1,
      secondaryhierarchy,
      hierarchyfilter2,
      tertiaryhierarchy,
      primaryhierarchyall,
      secondaryhierarchyall,
      tertiaryhierarchyall,
      branch,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      myallTotalNames,
      hierarchyFinal,
      hierarchyDefault,
      reportingusers, hierarchyfirstlevel;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []

    try {
      const { listpageaccessmode } = req.body;
      let clientidsmap;
      let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

      let finalDataRestrictList = []
      if (listpageaccessmode === "Reporting to Based") {
        let usersss = await User.find(
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
            reportingto: req.body.username,
          },
          {
            empcode: 1,
            companyname: 1,
          }
        ).lean();
        const companyNames = usersss.map((user) => user.companyname);
        let clientids = await ClientUserid.find(
          {
            empname: { $in: companyNames },
          },
          { userid: 1 }
        ).lean();
        clientidsmap = clientids.map((user) => user.userid);
      }

      let prodresult = await Nonproduction.find(
        {
       mode:req.body.base,
      approvestatus:false,
          ...(listpageaccessmode === "Reporting to Based"
            ? { empname: { $in: req.body.username } }
            : {}),
        },
        {
          name: 1,
          category: 1,
          subcategory: 1,
          mode: 1,
          count: 1,
          date: 1,
          fromtime: 1,
          totime: 1,
          totalhours: 1,
          alloteddays: 1,
          allotedhours: 1,
          allotedminutes: 1,
          days: 1,
          hours: 1,
          minutes: 1,
           rejectreason:1,
          createdAt: 1,
          _id: 1,
        }
      );

      clientuserid = await ClientUserid.find(
        { loginallotlog: { $exists: true, $ne: [] } },
        { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
      ).lean();

      result = prodresult.map((item) => {
        return {
          category: item.category,
          subcategory: item.subcategory,
          mode: item.mode,
          count:item.count,
          date: item.date,
          fromtime: item.fromtime,
          totime:item.totime,
          totalhours:item.totalhours,
          alloteddays:item.alloteddays,
          allotedhours:item.allotedhours,
          allotedminutes:item.allotedminutes,
          days: item.days,
          hours: item.hours,
          minutes:item.minutes,
           rejectreason:item.rejectreason,
          createdAt: item.createdAt,
          _id: item._id,
          companyname: item.name,
        };
      });
      resultsectorother = result
      //myhierarchy dropdown
      if (
        req.body.hierachy === "myhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchy = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: req.body.sector,
        });
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        hierarchyFinal =
          req.body.sector === "all"
            ? answerDef.length > 0
              ? [].concat(...answerDef)
              : []
            : hierarchy.length > 0
              ? [].concat(...hierarchy.map((item) => item.employeename))
              : [];

        hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

        hierarchyfilter = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Primary",
        });
        primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
          ? hierarchyfilter.map((item) => item.employeename[0])
          : [];

        hierarchyfilter1 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Secondary",
        });
        secondaryhierarchy = hierarchyfilter1.map(
          (item) => item.employeename[0]
        )
          ? hierarchyfilter1.map((item) => item.employeename[0])
          : [];

        hierarchyfilter2 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Tertiary",
        });
        tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
          ? hierarchyfilter2.map((item) => item.employeename[0])
          : [];

        resulted = result
          .map((userObj) => {
            const matchingHierarchy = hierarchyDefault.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
            category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
              createdAt: userObj.createdAt,
              _id: userObj._id,
              level: matchingHierarchy ? matchingHierarchy.level : "",
              control: matchingHierarchy ? matchingHierarchy.control : "",
            };
          })
          .filter((data) => hierarchyMap.includes(data.companyname));
      }

      if (
        req.body.hierachy === "allhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );


        // let sectorFinal = req.body.sector == "all"
        //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        // hierarchyDefault = await Hirerarchi.find({
        //   supervisorchoose: req.body.username,
        //   level: { $in: sectorFinal },

        // });


        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault
          .map((data) => data.employeename)
          .flat();

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          answerDef,
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        resultedTeam = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
              _id: userObj._id,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));

        if (resultedTeam.length == 0) {

          let sectorFinal = req.body.sector == "all"
            ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

          let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
            supervisorchoose: req.body.username,
          }, { level: 1 });

          FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
          //  let hierarchySecond2 = await Hirerarchi.find({});
          hierarchySecond = await Hirerarchi.find(
            {},
            { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
          );

          hierarchyDefault = await Hirerarchi.find({
            supervisorchoose: req.body.username,
            //  level: { $nin: sectorFinal },

          });

          console.log(hierarchySecond.length, "hierarchyDefault")

          let answerDef = hierarchyDefault
            .map((data) => data.employeename)
            .flat();

          console.log(answerDef, "answerDef")

          function findEmployeesRecursive(
            currentSupervisors,
            processedSupervisorsallsector,
            resultsectorother
          ) {
            const filteredData = hierarchySecond.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            if (filteredData.length === 0) {
              return resultsectorother;
            }

            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
              return employees;
            }, []);

            const uniqueNewEmployees = [...new Set(newEmployees)];
            resultsectorother = [...resultsectorother, ...filteredData];
            // console.log(result, "result")
            return findEmployeesRecursive(
              uniqueNewEmployees,
              processedSupervisorsallsector,
              resultsectorother
            );
          }

          const processedSupervisorsallsector = new Set();
          const filteredOverallItem = findEmployeesRecursive(
            answerDef,
            processedSupervisorsallsector,
            []
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }



      }

      //my + all hierarchy list dropdown

      if (
        req.body.hierachy === "myallhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );

        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          [req.body.username],
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        filteredoverall = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
               category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
              _id: userObj._id,
              createdAt: userObj.createdAt,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));



        //alert there is no sector
        if (filteredoverall.length == 0) {

          let hierarchySecond2 = await Hirerarchi.find();
          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
          console.log(hierarchyfirstlevel, "hierarchyfirstlevel")

          function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
            const filteredData = hierarchySecond2.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            console.log(filteredData.length, "l;lp");
            if (filteredData.length === 0) {
              return resultsectorother; // No more employees to process
            }

            // Collect new employees
            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
              return employees;
            }, []);

            // Prevent duplicates
            const uniqueNewEmployees = [...new Set(newEmployees)];

            // **Modify `resultall` in place** instead of reassigning it
            resultsectorother.push(...filteredData);

            // console.log(result, "resultall1");

            // Recursive call with new employees
            return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
          }

          const processedSupervisorsallsector = new Set();
          // const resultall = []; // Define `resultall` outside to maintain reference

          const filteredOverallItem = findEmployeesRecursive(
            [req.body.username],
            processedSupervisorsallsector,
            resultsectorother // Pass the reference instead of a new array
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }

     
      }

      if (listpageaccessmode === "Reporting to Based") {
        reportingtobaseduser = result.map((userObj) => {
          return {
            companyname: userObj.companyname,
             category: userObj.category,
          subcategory: userObj.subcategory,
          mode: userObj.mode,
          count:userObj.count,
          date: userObj.date,
          fromtime: userObj.fromtime,
          totime:userObj.totime,
          totalhours:userObj.totalhours,
          alloteddays:userObj.alloteddays,
          allotedhours:userObj.allotedhours,
          allotedminutes:userObj.allotedminutes,
          days: userObj.days,
          hours: userObj.hours,
          minutes:userObj.minutes,
           rejectreason:userObj.rejectreason,
            _id: userObj._id,
            level: "",
            control: "",
          };
        });
      }

   

      let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)

      const restrictTeam = await Hirerarchi.aggregate([
        {
          $match: {
            $or: [
              {
                supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
              },
              {
                employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
              }
            ],
            level: { $in: levelFinal } // Matches if level field has a value in levelFinal
          },
        },
        {
          $lookup: {
            from: "reportingheaders",
            let: {
              teamControlsArray: {
                $ifNull: ["$pagecontrols", []]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$name",
                          "$$teamControlsArray"
                        ]
                      }, // Check if 'name' is in 'teamcontrols' array
                      {
                        $in: [
                          req?.body?.pagename,
                          "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                        ]
                      } // Additional condition for reportingnew array
                    ]
                  }
                }
              }
            ],
            as: "reportData" // The resulting matched documents will be in this field
          }
        },
        {
          $project: {
            supervisorchoose: 1,
            employeename: 1,
            reportData: 1
          }
        }
      ]);
      let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
      console.log(restrictListTeam, resultedTeam, "restrictListTeam")
      resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
      resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];

      console.log(resultAccessFilter, resultAccessFilterHierarchy.length, filteredoverallsectorall, "oooo")
    
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // result
      // resulted,
      // resultedTeam,
      // branch,
      // hierarchy,
      // overallMyallList,
      hierarchyfirstlevel,
      filteredoverallsectorall,
      resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
      resultAccessFilter,
      // primaryhierarchy,
      //  secondaryhierarchy,
      //  tertiaryhierarchy,
      //  primaryhierarchyall,
      //  secondaryhierarchyall,
      //  tertiaryhierarchyall,
      //  primaryhierarchyfinal,
      //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
  }
);

