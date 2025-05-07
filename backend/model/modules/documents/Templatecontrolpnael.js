const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const templatecontrolpanelSchema = new Schema({
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    emailformat: {
        type: String,
        required: false,
    },
    fromemail: {
        type: String,
        required: false,
    },
    toemail: {
        type: String,
        required: false,
    },
    ccemail: {
        type: [String],
        required: false,
    },
    bccemail: {
        type: [String],
        required: false,
    },
    letterheadcontentheader: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    letterheadcontentfooter: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    letterheadbodycontent: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    companyurl: {
        type: String,
        required: false,
    },
    idcardfrontheader: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    idcardfrontfooter: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    idcardbackheader: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    idcardbackfooter: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],
    companyname: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    toCompany: [
        {
            toCompanyname: {
                type: String,
                required: false,
            },
            toAddress: {
                type: String,
                required: false,
            },

        }
    ],

    documentcompany: [
        {
            preview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            data: {
                type: String,
                required: false
            },
            remark: {
                type: String,
                required: false
            }

        }
    ],

    documentseal: [
        {
            name: {
                type: String,
                required: false,
            },
            seal: {
                type: String,
                required: false,
            },
            document: [
                {
                    preview: {
                        type: String,
                        required: false
                    },
                    name: {
                        type: String,
                        required: false
                    },
                    data: {
                        type: String,
                        required: false
                    },
                    remark: {
                        type: String,
                        required: false
                    }

                }
            ],
        },
    ],
    documentsignature: [
        {
            unit: {
                type: String,
                required: false,
            },
            team: {
                type: String,
                required: false,
            },
            employee: {
                type: String,
                required: false,
            },
            signaturename: {
                type: String,
                required: false,
            },
            seal: {
                type: String,
                required: false,
            },
            topcontent: {
                type: String,
                required: false,
            },
            bottomcontent: {
                type: String,
                required: false,
            },
            document: [
                {
                    preview: {
                        type: String,
                        required: false
                    },
                    name: {
                        type: String,
                        required: false
                    },
                    data: {
                        type: String,
                        required: false
                    },
                    remark: {
                        type: String,
                        required: false
                    }

                }
            ],
        },
    ],
    templatecontrolpanellog: [{
        company: {
            type: String,
            required: false,
        },
        branch: {
            type: String,
            required: false,
        },
        emailformat: {
            type: String,
            required: false,
        },
        fromemail: {
            type: String,
            required: false,
        },
        toemail: {
            type: String,
            required: false,
        },
        ccemail: {
            type: [String],
            required: false,
        },
        bccemail: {
            type: [String],
            required: false,
        },
        letterheadcontentheader: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        letterheadcontentfooter: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        letterheadbodycontent: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        companyurl: {
            type: String,
            required: false,
        },
        idcardfrontheader: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        idcardfrontfooter: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        idcardbackheader: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        idcardbackfooter: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],
        companyname: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        createdAt: {
            type: String,
            required: false,
        },
        toCompany: [
            {
                toCompanyname: {
                    type: String,
                    required: false,
                },
                toAddress: {
                    type: String,
                    required: false,
                },
    
            }
        ],
        documentcompany: [
            {
                preview: {
                    type: String,
                    required: false
                },
                name: {
                    type: String,
                    required: false
                },
                data: {
                    type: String,
                    required: false
                },
                remark: {
                    type: String,
                    required: false
                }

            }
        ],

        documentseal: [
            {
                name: {
                    type: String,
                    required: false,
                },
                seal: {
                    type: String,
                    required: false,
                },
                document: [
                    {
                        preview: {
                            type: String,
                            required: false
                        },
                        name: {
                            type: String,
                            required: false
                        },
                        data: {
                            type: String,
                            required: false
                        },
                        remark: {
                            type: String,
                            required: false
                        }

                    }
                ],
            },
        ],
        documentsignature: [
            {
                unit: {
                    type: String,
                    required: false,
                },
                team: {
                    type: String,
                    required: false,
                },
                employee: {
                    type: String,
                    required: false,
                },
                signaturename: {
                    type: String,
                    required: false,
                },
                seal: {
                    type: String,
                    required: false,
                },
                topcontent: {
                    type: String,
                    required: false,
                },
                bottomcontent: {
                    type: String,
                    required: false,
                },
                document: [
                    {
                        preview: {
                            type: String,
                            required: false
                        },
                        name: {
                            type: String,
                            required: false
                        },
                        data: {
                            type: String,
                            required: false
                        },
                        remark: {
                            type: String,
                            required: false
                        }

                    }
                ],
            },
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

            }],
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

            }],

    }],
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

        }],
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

        }],
});
module.exports = mongoose.model(
    "templatecontrolpanel",
    templatecontrolpanelSchema
);